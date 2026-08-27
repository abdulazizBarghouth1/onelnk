<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessDirectorySetting extends Model
{
    protected $fillable = [
        'title', 'description', 'menu_items', 'config_sections'
    ];

    protected $casts = [
        'menu_items' => 'array',
        'config_sections' => 'array'
    ];

    public static function getSettings()
    {
        $settings = self::first();
        
        if (!$settings) {
            $defaultConfig = [
                'theme' => [
                    'primary_color' => '#3b82f6',
                    'secondary_color' => '#8b5cf6',
                    'accent_color' => '#10b77f'
                ],

                'hero' => [
                    'trust_badge' => 'Trusted by 10,000+ Businesses',
                    'main_title' => 'Discover Amazing Businesses',
                    'subtitle' => 'Connect with professionals, explore services, and grow your network in our comprehensive business directory',
                    'features' => [
                        ['icon' => 'verified', 'text' => 'Verified Businesses'],
                        ['icon' => 'location', 'text' => 'Local & Global'],
                        ['icon' => 'contact', 'text' => 'Instant Contact']
                    ]
                ],
                'header' => [
                'variant' => 'header1',
                'transparent' => false,
                'background_color' => '#ffffff',
                'text_color' => '#1f2937',
                'navigation_items' => [
                            [
                            'text' => 'About Us',
                            'type' => 'page',
                            'href' => route('directory.custom-page.show', 'about'),
                            'target' => '_self'
                        ],
                        [
                            'text' => 'Privacy Policy',
                            'type' => 'page',
                            'href' => route('directory.custom-page.show', 'privacy-policy'),
                            'target' => '_self'
                        ],
                        [
                            'text' => 'Terms of Service',
                            'type' => 'page',
                            'href' => route('directory.custom-page.show', 'terms-of-service'),
                            'target' => '_self'
                        ],
                        [
                            'text' => 'Businesses',
                            'type' => 'link',
                            'href' => '#businesses',
                            'target' => '_self'
                        ],
                        [
                            'text' => 'FAQ',
                            'type' => 'link',
                            'href' => '#faq',
                            'target' => '_self'
                        ],
                        [
                            'text' => 'Categories',
                            'type' => 'link',
                            'href' => '#categories',
                            'target' => '_self'
                        ],
                    ],
                ],
                'section_order' => ['hero', 'search', 'categories', 'businesses'],
                'section_visibility' => [
                    'hero' => true,
                    'search' => true,
                    'categories' => true,
                    'businesses' => true,
                ]
            ];
            
            $settings = self::create([
                'title' => 'Business Directory',
                'description' => 'Discover amazing businesses and connect with professionals',
                'config_sections' => $defaultConfig
            ]);
        }
        
        return $settings;
    }

    public function customPages()
    {
        return $this->hasMany(\App\Models\BusinessDirectoryCustomPage::class, 'id', 'id');
    }

    public static function getActiveCustomPages()
    {
        return \App\Models\BusinessDirectoryCustomPage::active()->ordered()->get();
    }
}