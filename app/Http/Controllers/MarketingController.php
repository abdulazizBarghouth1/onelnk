<?php

namespace App\Http\Controllers;

use App\Models\LandingPageSetting;
use App\Models\NfcCard;
use App\Models\Plan;
use Inertia\Inertia;

/**
 * Serves the OneLnk standalone marketing pages (product, gallery, teams, about,
 * contact, faq). Each shares the landing brand settings so the reskinned
 * Header/Footer render, but the page content itself is static.
 */
class MarketingController extends Controller
{
    private function props(): array
    {
        $landingSettings = LandingPageSetting::getSettings();

        return [
            'settings' => array_merge($landingSettings->toArray(), [
                'registrationEnabled' => getSetting('registrationEnabled', true),
            ]),
        ];
    }

    /** Id of the first enabled catalog card, so marketing pages can deep-link to its detail page. */
    private function defaultCardId(): ?int
    {
        return NfcCard::where('is_enabled', true)->orderBy('price')->value('id');
    }

    public function product()
    {
        return Inertia::render('marketing/product', $this->props());
    }

    public function gallery()
    {
        return Inertia::render('marketing/gallery', array_merge($this->props(), [
            'productCardId' => $this->defaultCardId(),
            'galleryItems' => \App\Models\GalleryItem::where('is_enabled', true)
                ->orderBy('sort_order')->orderBy('id')
                ->get()
                ->map(fn ($item) => ['id' => $item->id, 'image' => getAssetUrl($item->image)])
                ->values(),
        ]));
    }

    public function teams()
    {
        return Inertia::render('marketing/teams', $this->props());
    }

    public function about()
    {
        return Inertia::render('marketing/about', $this->props());
    }

    public function contact()
    {
        return Inertia::render('marketing/contact', $this->props());
    }

    public function faq()
    {
        return Inertia::render('marketing/faq', $this->props());
    }

    /** Packages / pricing page — the tier cards bind to the real enabled Plan records. */
    public function packages()
    {
        // Cards bind to the real Plans; capability flags → display labels via the
        // shared Plan::featureLabelList() (single source of truth across the app).
        $plans = Plan::where('is_plan_enable', 'on')
            ->orderBy('price')
            ->get()
            ->map(fn ($plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => (float) $plan->price,
                'yearly_price' => (float) $plan->yearly_price,
                'duration' => $plan->duration,
                'description' => $plan->description,
                'features' => $plan->featureLabelList(),
                'is_plan_enable' => $plan->is_plan_enable,
            ]);

        return Inertia::render('marketing/packages', array_merge($this->props(), [
            'plans' => $plans,
        ]));
    }

    /** Single product-detail page bound to a real NfcCard catalog record. */
    public function productDetails(NfcCard $card)
    {
        if (! $card->is_enabled) {
            abort(404);
        }

        return Inertia::render('marketing/product-details', array_merge($this->props(), [
            'card' => [
                'id'            => $card->id,
                'name'          => $card->name,
                'description'   => $card->description,
                'features'      => $card->features ?: [],
                'tags'          => $card->tags ?: [],
                'price'         => (float) $card->price,
                'compare_price' => $card->compare_price !== null ? (float) $card->compare_price : null,
                'front_image'   => $card->front_image ? getAssetUrl($card->front_image) : null,
                'back_image'    => $card->back_image ? getAssetUrl($card->back_image) : null,
            ],
        ]));
    }
}
