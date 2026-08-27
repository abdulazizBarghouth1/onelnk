<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\LandingPageSetting;
use App\Models\NfcCard;
use App\Models\NfcCardOrderRequest;
use App\Models\Plan;
use App\Models\User;
use App\Services\DomainValidationService;
use App\Services\EmailTemplateService;
use App\Services\StorageConfigService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Public "create your card" wizard: design a physical NFC card + digital
 * profile, pick a digital plan, and place a paid order (COD/manual at launch).
 * Anonymous design is allowed; store() is auth-gated (login/register happens at
 * the checkout step). Reuses the same Business/config_sections persistence as
 * the dashboard vCard builder, plus the extended NfcCardOrderRequest as the order.
 */
class CreateCardController extends Controller
{
    /** Brand settings so the shared Header/Footer render (mirrors MarketingController). */
    private function brandSettings(): array
    {
        return array_merge(LandingPageSetting::getSettings()->toArray(), [
            'registrationEnabled' => getSetting('registrationEnabled', true),
        ]);
    }

    public function create(Request $request)
    {
        // Priced card catalog (the 3 types) with their marketing copy.
        $cardTypes = NfcCard::where('is_enabled', true)
            ->orderBy('price')
            ->get(['id', 'name', 'description', 'features', 'tags', 'price', 'front_image', 'back_image'])
            ->map(function ($card) {
                $card->front_image = $card->front_image ? getAssetUrl($card->front_image) : null;
                $card->back_image = $card->back_image ? getAssetUrl($card->back_image) : null;
                return $card;
            });

        // Digital plans for step 5 — features flattened to display labels (same
        // mapping used by the home/packages/dashboard pricing surfaces).
        $plans = Plan::where('is_plan_enable', 'on')
            ->orderBy('price')
            ->get()
            ->map(fn ($plan) => [
                'id'           => $plan->id,
                'name'         => $plan->name,
                'price'        => (float) $plan->price,
                'yearly_price' => (float) $plan->yearly_price,
                'description'  => $plan->description,
                'features'     => $plan->featureLabelList(),
                // Smart summary numbers (same mapping the admin /plans page uses).
                'stats'        => [
                    'businesses' => $plan->business,
                    'users'      => $plan->max_users,
                    'storage'    => $plan->storage_limit . ' GB',
                    'templates'  => is_array($plan->themes) ? count($plan->themes) : 34,
                    'bio_links'  => $plan->bio_links,
                    'bio_themes' => is_array($plan->bio_links_themes) ? count($plan->bio_links_themes) : 14,
                ],
                'is_trial'     => $plan->is_trial,
                'trial_day'    => $plan->trial_day,
            ]);

        return Inertia::render('create-card/index', [
            'cardTypes' => $cardTypes,
            'plans' => $plans,
            'shipping' => [
                'fee' => (float) getSetting('shipping_fee', 0),
                'free_threshold' => (float) getSetting('free_shipping_threshold', 0),
            ],
            'settings' => $this->brandSettings(),
        ]);
    }

    public function store(Request $request)
    {
        // Inline auth: the wizard authenticates in this same request so nothing is
        // lost (no page reload). A logged-out buyer submits credentials alongside the
        // order — either signing in or creating a company account — then the order is
        // placed as that user.
        $user = $request->user();
        if (!$user) {
            $user = $this->authenticateInline($request);
        }

        $validated = $request->validate([
            // Physical card
            'nfc_card_id'        => 'required|exists:nfc_cards,id',
            'quantity'           => 'required|integer|min:1|max:1000',
            'card_color'         => 'nullable|string|max:32',
            'text_color'         => 'nullable|string|max:32',
            'card_design'        => 'nullable|array',
            'logo'               => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',

            // Digital profile imagery (optional; injected into config_sections)
            'profile_image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'cover_image'        => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'profile_logo'       => 'nullable|image|mimes:png,svg|max:2048',

            // Digital profile (assembled by the wizard, same shape as vCard builder)
            'name'               => 'required|string|max:255',
            'slug'               => 'nullable|string|max:255',
            'business_type'      => 'required|string',
            'config_sections'    => 'required|array',

            // Digital plan (step 5)
            'plan_id'            => 'nullable|exists:plans,id',

            // Delivery (step 7)
            'recipient_name'     => 'required|string|max:255',
            'recipient_phone'    => 'required|string|max:64',
            'recipient_email'    => 'required|email|max:255',
            'city'               => 'nullable|string|max:255',
            'shipping_address'   => 'required|string',
            'delivery_notes'     => 'nullable|string',

            // Payment: COD, or a MOCK "online" method (no real gateway yet — the
            // order is recorded but not charged; a real gateway is integrated later).
            'payment_method'     => 'required|in:cod,online',
        ]);

        $card = NfcCard::findOrFail($validated['nfc_card_id']);
        if ($card->quantity <= 0) {
            return back()->with('error', __('This card is currently out of stock.'));
        }

        // --- Pricing + shipping -------------------------------------------------
        $subtotal = round((float) $card->price * (int) $validated['quantity'], 2);
        $shippingFee = (float) getSetting('shipping_fee', 0);
        $freeThreshold = (float) getSetting('free_shipping_threshold', 0);
        $shipping = ($freeThreshold > 0 && $subtotal >= $freeThreshold) ? 0.0 : $shippingFee;

        // Digital plan billed at its YEARLY price as a line item (0 for free/none).
        // COD is retained for launch; a payment gateway replaces it later — the total
        // must simply be correct now.
        $planPrice = 0.0;
        if (!empty($validated['plan_id'])) {
            $orderPlan = Plan::find($validated['plan_id']);
            if ($orderPlan && (float) $orderPlan->price > 0) {
                $planPrice = round((float) $orderPlan->yearly_price, 2);
            }
        }
        $total = round($subtotal + $shipping + $planPrice, 2);

        // --- Create the digital profile (Business) ------------------------------
        $slug = ($validated['slug'] ?? null) ?: $validated['name'];
        $slug = trim(preg_replace('/-+/', '-', preg_replace('/[^a-zA-Z0-9-_]/', '-', $slug)), '-');
        if ($slug === '') {
            $slug = DomainValidationService::generateUniqueSlug($validated['name'], null);
        } else {
            // Guarantee uniqueness against existing slugs on the default prefix.
            $base = $slug;
            $i = 1;
            while (Business::where('slug', $slug)->where('url_prefix', 'v')->exists()) {
                $slug = $base . '-' . (++$i);
            }
        }

        // --- Profile imagery → config_sections ---------------------------------
        // Store any uploaded digital-profile images and merge their paths into the
        // config the wizard assembled (profile_image is what the public card renders).
        $configSections = $validated['config_sections'];
        $disk = StorageConfigService::getActiveDisk();
        $storeImage = function ($file, string $folder) use ($disk): string {
            $name = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '', $file->getClientOriginalName());
            $path = 'media/' . $folder . '/' . $name;
            Storage::disk($disk)->put($path, file_get_contents($file));
            return $path;
        };
        if ($request->hasFile('profile_image')) {
            $configSections['header'] = ($configSections['header'] ?? []);
            $configSections['header']['profile_image'] = $storeImage($request->file('profile_image'), 'vcard-profiles');
        }
        if ($request->hasFile('cover_image')) {
            $configSections['_onelnk'] = ($configSections['_onelnk'] ?? []);
            $configSections['_onelnk']['cover_image'] = $storeImage($request->file('cover_image'), 'vcard-covers');
        }
        if ($request->hasFile('profile_logo')) {
            $configSections['_onelnk'] = ($configSections['_onelnk'] ?? []);
            $configSections['_onelnk']['logo_image'] = $storeImage($request->file('profile_logo'), 'vcard-logos');
        }

        $business = Business::create([
            'name'             => $validated['name'],
            'slug'             => $slug,
            'business_type'    => $validated['business_type'],
            'config_sections'  => $configSections,
            'domain_type'      => 'slug',
            'url_prefix'       => 'v',
            'password_enabled' => false,
            'created_by'       => $user->id,
        ]);

        // --- Physical card logo upload -----------------------------------------
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $disk = StorageConfigService::getActiveDisk();
            $fileName = time() . '_' . $request->file('logo')->getClientOriginalName();
            $logoPath = 'nfc-order-logos/' . $fileName;
            Storage::disk($disk)->put($logoPath, file_get_contents($request->file('logo')));
        }

        // --- Create the order ---------------------------------------------------
        $order = NfcCardOrderRequest::create([
            'user_id'          => $user->id,
            'nfc_card_id'      => $card->id,
            'business_id'      => $business->id,
            'plan_id'          => $validated['plan_id'] ?? null,
            'quantity'         => $validated['quantity'],
            'card_color'       => $validated['card_color'] ?? null,
            'text_color'       => $validated['text_color'] ?? null,
            'card_design'      => $validated['card_design'] ?? null,
            'logo'             => $logoPath,
            'original_price'   => $card->price,
            'subtotal'         => $subtotal,
            'shipping_fee'     => $shipping,
            'total_price'      => $total,
            'recipient_name'   => $validated['recipient_name'],
            'recipient_phone'  => $validated['recipient_phone'],
            'recipient_email'  => $validated['recipient_email'],
            'city'             => $validated['city'] ?? null,
            'shipping_address' => $validated['shipping_address'],
            'delivery_notes'   => $validated['delivery_notes'] ?? null,
            'payment_method'   => $validated['payment_method'],
            'payment_status'   => 'pending',
            'status'           => 'pending',
        ]);

        // --- Assign the selected plan -------------------------------------------
        // Free plans activate immediately; paid plans are granted when the admin
        // approves the order (see NfcCardController@approveOrderRequest).
        if (!empty($validated['plan_id'])) {
            $plan = Plan::find($validated['plan_id']);
            if ($plan && ((float) $plan->price === 0.0 || is_null($user->plan_id))) {
                $user->plan_id = $plan->id;
                $user->save();
            }
        }

        // --- Transactional emails (wrapped so a mail failure never breaks the order) ---
        $this->sendOrderEmails($order, $business, $card, $total);

        return Inertia::render('create-card/confirmation', [
            'settings' => $this->brandSettings(),
            'order' => [
                'order_number' => $order->order_number,
                'total'        => $total,
                'card_name'    => $card->name,
                'quantity'     => $order->quantity,
                'recipient'    => $order->recipient_name,
                'city'         => $order->city,
                'profile_url'  => url('/v/' . $business->slug),
            ],
        ]);
    }

    /**
     * Authenticate (or register) the buyer inline during checkout. Throws a
     * ValidationException on bad credentials so Inertia surfaces field errors in
     * the wizard without navigating away.
     */
    private function authenticateInline(Request $request): User
    {
        $mode = $request->input('auth_mode') === 'register' ? 'register' : 'login';

        if ($mode === 'register') {
            // Respect the admin "registration enabled" switch — no inline signup when off.
            if (!getSetting('registrationEnabled', true)) {
                throw ValidationException::withMessages([
                    'auth_email' => [__('Registration is currently disabled. Please sign in instead.')],
                ]);
            }

            $data = $request->validate([
                'auth_name'                  => 'required|string|max:255',
                'auth_email'                 => 'required|string|lowercase|email|max:255|unique:users,email',
                'auth_password'              => ['required', 'confirmed', Password::defaults()],
                'auth_terms'                 => 'accepted',
            ], [], [
                'auth_name' => __('name'), 'auth_email' => __('email'), 'auth_password' => __('password'),
            ]);

            $superAdmin = User::where('type', 'superadmin')->first();
            $defaultLang = $superAdmin
                ? (\App\Models\Setting::where('user_id', $superAdmin->id)->where('key', 'defaultLanguage')->value('value') ?? 'en')
                : 'en';

            $user = User::create([
                'name'            => $data['auth_name'],
                'email'           => $data['auth_email'],
                'password'        => Hash::make($data['auth_password']),
                'type'            => 'company',
                'is_active'       => 1,
                'is_enable_login' => 1,
                'created_by'      => 0,
                'plan_is_active'  => 0,
                'lang'            => $defaultLang,
            ]);
            defaultRoleAndSetting($user);
            Auth::login($user);
            $this->sendWelcomeEmail($user);

            return $user;
        }

        $creds = $request->validate([
            'auth_email'    => 'required|email',
            'auth_password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => $creds['auth_email'], 'password' => $creds['auth_password']], (bool) $request->boolean('auth_remember'))) {
            throw ValidationException::withMessages([
                'auth_email' => [__('These credentials do not match our records.')],
            ]);
        }
        $request->session()->regenerate();

        return $request->user();
    }

    /** Order confirmation to the customer + a new-order alert to the admin. */
    private function sendOrderEmails(NfcCardOrderRequest $order, Business $business, NfcCard $card, float $total): void
    {
        $mailer = app(EmailTemplateService::class);
        $vars = [
            'order_number'  => $order->order_number,
            'customer_name' => $order->recipient_name,
            'card_name'     => $card->name,
            'quantity'      => $order->quantity,
            'total'         => number_format($total, 2),
            'status'        => $order->status,
            'profile_url'   => url('/v/' . $business->slug),
            'app_name'      => getSetting('titleText', config('app.name')),
        ];

        try {
            $mailer->sendTemplateEmail('Order Confirmation', $vars, $order->recipient_email, $business, $order->recipient_name);
        } catch (\Throwable $e) {
            \Log::warning('Order confirmation email failed: ' . $e->getMessage());
        }

        $adminEmail = getSetting('email_from_address') ?: optional(User::where('type', 'superadmin')->first())->email;
        if ($adminEmail) {
            try {
                $mailer->sendTemplateEmail('New Order', $vars, $adminEmail, $business);
            } catch (\Throwable $e) {
                \Log::warning('New-order admin email failed: ' . $e->getMessage());
            }
        }
    }

    /** Welcome email for a self-registered buyer (no password, unlike admin-created accounts). */
    private function sendWelcomeEmail(User $user): void
    {
        try {
            app(EmailTemplateService::class)->sendTemplateEmail('Welcome', [
                'name'     => $user->name,
                'email'    => $user->email,
                'app_name' => getSetting('titleText', config('app.name')),
                'login_url' => route('login'),
            ], $user->email, null, $user->name);
        } catch (\Throwable $e) {
            \Log::warning('Welcome email failed: ' . $e->getMessage());
        }
    }
}
