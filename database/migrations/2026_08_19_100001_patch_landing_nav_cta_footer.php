<?php

use App\Models\LandingPageSetting;
use Illuminate\Database\Migrations\Migration;

/**
 * Patches the existing landing_page_settings row so the live site picks up the
 * corrected navbar dropdown links, CTA copy, and footer legal links. The model's
 * getSettings() only ADDS missing sections (never overwrites existing content),
 * so stale vCard defaults saved in an existing row would otherwise persist —
 * including nav hrefs that were saved as absolute URLs pointing at the wrong
 * host. Fresh installs get these same values from LandingPageSetting::$defaultConfig.
 * Content patch: down() is intentionally a no-op.
 */
return new class extends Migration
{
    public function up(): void
    {
        $settings = LandingPageSetting::first();
        if (! $settings) {
            return; // fresh installs read the corrected defaults from getSettings()
        }

        $config = $settings->config_sections;
        if (! is_array($config) || empty($config['sections'])) {
            return;
        }

        $nav = [
            ['text' => 'Product',  'type' => 'link', 'href' => '/product',  'target' => '_self'],
            ['text' => 'Packages', 'type' => 'link', 'href' => '/packages', 'target' => '_self'],
            ['text' => 'Gallery',  'type' => 'link', 'href' => '/gallery',  'target' => '_self'],
            ['text' => 'Teams',    'type' => 'link', 'href' => '/teams',    'target' => '_self'],
            ['text' => 'About',    'type' => 'link', 'href' => '/about',    'target' => '_self'],
            ['text' => 'Contact',  'type' => 'link', 'href' => '/contact',  'target' => '_self'],
        ];

        $legal = [
            ['name' => 'Privacy Policy',      'href' => '/page/privacy-policy'],
            ['name' => 'Terms & Conditions',  'href' => '/page/terms-of-service'],
            ['name' => 'Shipping Policy',     'href' => '/page/shipping-policy'],
        ];

        foreach ($config['sections'] as &$section) {
            $key = $section['key'] ?? null;

            if ($key === 'header') {
                $section['navigation_items'] = $nav;
                $section['show_business_directory'] = false;
            } elseif ($key === 'cta') {
                $section['title'] = 'Ready to create';
                $section['subtitle'] = 'your smart business card?';
            } elseif ($key === 'footer') {
                $section['links'] = array_merge($section['links'] ?? [], ['legal' => $legal]);
            }
        }
        unset($section);

        $settings->config_sections = $config;
        $settings->save();
    }

    public function down(): void
    {
        // Content patch — not reverted.
    }
};
