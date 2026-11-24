<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Business;
use App\Models\Circle;
use App\Models\Organization;
use App\Traits\ResolvesTenantBusinesses;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    use ResolvesTenantBusinesses;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authUser = auth()->user();
        
        // Get accessible businesses based on user type and permissions
        if ($authUser->type === 'company') {
            $staffIds = User::where('created_by', $authUser->id)->pluck('id')->toArray();
            $staffIds = array_merge([$authUser->id], $staffIds);
            $accessibleBusinesses = Business::whereIn('created_by', $staffIds)->pluck('id');
        } else {
            // Staff users can only access businesses created by their company
            if ($authUser->can('manage-contacts') || $authUser->can('view-contacts')) {
                $accessibleBusinesses = Business::where('created_by', $authUser->id)->pluck('id');
            } else {
                $accessibleBusinesses = collect([]);
            }
        }
        
        // If no accessible businesses, return empty result
        if ($accessibleBusinesses->isEmpty()) {
            $contacts = Contact::whereRaw('1 = 0')->paginate($request->get('per_page', 10));
            $businesses = collect([]);
            $circles = collect([]);
            $organizations = collect([]);
        } else {
            $query = Contact::with(['business', 'organization:id,name', 'circles:id,name,color'])
                ->whereIn('business_id', $accessibleBusinesses)
                ->orderBy($request->get('sort_field', 'created_at'), $request->get('sort_direction', 'desc'));

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhereHas('business', function ($businessQuery) use ($search) {
                          $businessQuery->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Business filter
            if ($request->filled('business')) {
                $businessId = $request->get('business');
                // Ensure the requested business is accessible to the user
                if ($accessibleBusinesses->contains($businessId)) {
                    $query->where('business_id', $businessId);
                } else {
                    // If user tries to access unauthorized business, return empty result
                    $query->whereRaw('1 = 0');
                }
            }

            // Status filter
            if ($request->filled('status')) {
                $query->where('status', $request->get('status'));
            }

            // Circle filter
            if ($request->filled('circle')) {
                $circleId = $request->get('circle');
                $query->whereHas('circles', function ($q) use ($circleId) {
                    $q->where('circles.id', $circleId);
                });
            }

            $contacts = $query->paginate($request->get('per_page', 10));
            $businesses = Business::whereIn('id', $accessibleBusinesses)->orderBy('name')->get(['id', 'name']);
            $circles = Circle::whereIn('business_id', $accessibleBusinesses)->orderBy('name')->get(['id', 'name', 'color', 'business_id']);
            $organizations = Organization::whereIn('business_id', $accessibleBusinesses)->orderBy('name')->get(['id', 'name', 'business_id']);
        }

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
            'businesses' => $businesses,
            'circles' => $circles,
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'business', 'status', 'circle', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|regex:/^\+\d{6,20}$/',
            'message' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
            'notes' => 'nullable|string',
            'emails' => 'nullable|array',
            'emails.*' => 'nullable|email|max:255',
            'phones' => 'nullable|array',
            'phones.*' => 'nullable|string|max:40',
            'job_title' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
            'avatar' => 'nullable|string|max:2048',
            'organization' => 'nullable|string|max:255',
            'circles' => 'nullable|array',
            'circles.*' => 'nullable|string|max:255',
        ],
[
            'phone.regex' => __('Please enter a valid phone number (select the country code, then enter the number).'),
        ]);

        // Verify user has access to the business
        $authUser = auth()->user();
        $business = Business::find($validated['business_id']);

        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }

        $contact = Contact::create($this->contactColumns($validated) + [
            'organization_id' => $this->resolveOrganizationId($request->input('organization'), $business->id, $authUser),
            'created_by' => $authUser->id,
            'source' => 'manual',
        ]);

        $this->syncCircles($contact, (array) $request->input('circles', []), $authUser);

        return redirect()->back()->with('success', __('Contact created successfully.'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        // Verify user has access to the contact's business
        $authUser = auth()->user();
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $hasAccess = false;
        if ($authUser->type === 'company') {
            $hasAccess = $business->created_by === $authUser->id;
        } else {
            // Staff users can only update contacts for businesses created by their company
            if ($authUser->can('manage-contacts') || $authUser->can('edit-contacts')) {
                $hasAccess = $business->created_by === $authUser->created_by;
            }
        }
        
        if (!$hasAccess) {
            return redirect()->back()->with('error', __('You do not have permission to update this contact.'));
        }
        
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|regex:/^\+\d{6,20}$/',
            'message' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
            'notes' => 'nullable|string',
            'emails' => 'nullable|array',
            'emails.*' => 'nullable|email|max:255',
            'phones' => 'nullable|array',
            'phones.*' => 'nullable|string|max:40',
            'job_title' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
            'avatar' => 'nullable|string|max:2048',
            'organization' => 'nullable|string|max:255',
            'circles' => 'nullable|array',
            'circles.*' => 'nullable|string|max:255',
        ],
[
            'phone.regex' => __('Please enter a valid phone number (select the country code, then enter the number).'),
        ]);

        // Also verify the new business_id if it's being changed
        if ($validated['business_id'] != $contact->business_id) {
            $newBusiness = Business::find($validated['business_id']);
            if (!$newBusiness) {
                return redirect()->back()->with('error', __('New business not found.'));
            }
            
            $hasAccessToNewBusiness = false;
            if ($authUser->type === 'company') {
                $hasAccessToNewBusiness = $newBusiness->created_by === $authUser->id;
            } else {
                if ($authUser->can('manage-contacts') || $authUser->can('edit-contacts')) {
                    $hasAccessToNewBusiness = $newBusiness->created_by === $authUser->created_by;
                }
            }
            
            if (!$hasAccessToNewBusiness) {
                return redirect()->back()->with('error', __('You do not have permission to move this contact to the selected business.'));
            }
        }

        $contact->update($this->contactColumns($validated) + [
            'organization_id' => $this->resolveOrganizationId($request->input('organization'), $validated['business_id'], $authUser),
        ]);

        $this->syncCircles($contact, (array) $request->input('circles', []), $authUser);

        return redirect()->back()->with('success', __('Contact updated successfully.'));
    }

    /**
     * Send reply to contact.
     */
    public function reply(Request $request, Contact $contact)
    {
        // Verify user has access to the contact's business
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
        ]);

        // Always update status
        $contact->update(['status' => $validated['status']]);
        if (!empty($contact->email)) {
            try {
                setEmailConfigurations();
                $fromEmail = getSetting('email_from_address') ?: config('mail.from.address');
                $fromName  = getSetting('email_from_name') ?: config('mail.from.name');
                Mail::send([], [], function ($message) use ($contact, $validated, $fromEmail, $fromName) {
                    $message->to($contact->email, $contact->name)
                        ->subject($validated['subject'])
                        ->html(nl2br(e($validated['message'])))
                        ->from($fromEmail, $fromName);
                });

                return redirect()->back()->with('success', __('Reply sent successfully.'));
            } catch (\Exception $e) {
                Log::error('Failed to send reply: ' . $e->getMessage());
                return back()->with('error', __('Failed to send reply. Please check email settings.'));
            }
        }
        return redirect()->back()->with('success', __('Status updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        // Verify user has access to the contact's business
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $contact->delete();

        return redirect()->back()->with('success', __('Contact deleted successfully.'));
    }

    /**
     * Only the real contact columns (drops organization/circles helper inputs).
     */
    protected function contactColumns(array $validated): array
    {
        $columns = collect($validated)
            ->only([
                'business_id', 'name', 'email', 'phone', 'message', 'status', 'notes',
                'job_title', 'website', 'address', 'avatar',
            ])
            ->toArray();

        // Drop blank entries from the additional email/phone lists so we never
        // store [""] — leave the column null when nothing usable remains.
        $columns['emails'] = $this->cleanList($validated['emails'] ?? null);
        $columns['phones'] = $this->cleanList($validated['phones'] ?? null);

        return $columns;
    }

    /**
     * Trim a list input down to its non-empty values, or null if none remain.
     */
    protected function cleanList($values): ?array
    {
        $clean = collect(is_array($values) ? $values : [])
            ->map(fn ($v) => is_string($v) ? trim($v) : $v)
            ->filter(fn ($v) => $v !== null && $v !== '')
            ->values()
            ->all();

        return empty($clean) ? null : $clean;
    }

    /**
     * Resolve a company name to an organization id (creating it if new),
     * scoped to the contact's business. Accepts an id, a name, or empty.
     */
    protected function resolveOrganizationId($value, int $businessId, User $user): ?int
    {
        $value = is_string($value) ? trim($value) : $value;

        if (empty($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return Organization::where('id', $value)->where('business_id', $businessId)->value('id');
        }

        $organization = Organization::firstOrCreate(
            ['business_id' => $businessId, 'name' => $value],
            ['created_by' => $user->id]
        );

        return $organization->id;
    }

    /**
     * Sync a contact's circles from a list of names, creating new ones
     * (within the plan's circle limit) and attaching existing ones.
     */
    protected function syncCircles(Contact $contact, array $names, User $user): void
    {
        $names = collect($names)
            ->filter(fn ($n) => is_string($n))
            ->map(fn ($n) => trim($n))
            ->filter()
            ->unique(fn ($n) => mb_strtolower($n));

        $ids = [];
        $businessId = $contact->business_id;

        foreach ($names as $name) {
            $circle = Circle::where('business_id', $businessId)
                ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
                ->first();

            if (! $circle) {
                if ($this->circleLimitReached($user)) {
                    continue; // silently skip new circles once the plan cap is hit
                }
                $circle = Circle::create([
                    'business_id' => $businessId,
                    'created_by' => $user->id,
                    'name' => $name,
                    'color' => Circle::colorForName($name),
                ]);
            }

            $ids[] = $circle->id;
        }

        $contact->circles()->sync($ids);
    }

    /**
     * Whether the tenant has hit its plan's circle allowance.
     */
    protected function circleLimitReached(User $user): bool
    {
        $max = (int) ($this->tenantOwner($user)->getCurrentPlan()->max_circles ?? -1);

        if ($max === -1) {
            return false;
        }

        return Circle::whereIn('business_id', $this->accessibleBusinessIds($user))->count() >= $max;
    }
}