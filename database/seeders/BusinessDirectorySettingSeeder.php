<?php

namespace Database\Seeders;

use App\Models\BusinessDirectorySetting;
use Illuminate\Database\Seeder;

class BusinessDirectorySettingSeeder extends Seeder
{
    public function run(): void
    {
        // Create default directory settings if not exists
        if (!BusinessDirectorySetting::exists()) {
            BusinessDirectorySetting::create([
                'title'           => 'Business Directory',
                'description'     => 'Discover amazing businesses and connect with professionals',
                'config_sections' => [
                    'theme' => [
                        'primary_color'   => '#34CB91',
                        'secondary_color' => '#6E73F2',
                        'accent_color'    => '#C294DB'
                    ],

                    'hero' => [
                        'trust_badge' => 'Trusted by 10,000+ Businesses',
                        'main_title'  => 'Discover Amazing Businesses',
                        'subtitle'    => 'Connect with professionals, explore services, and grow your network in our comprehensive business directory',
                        'features'    => [
                            ['icon' => 'verified', 'text' => 'Verified Businesses'],
                            ['icon' => 'location', 'text' => 'Local & Global'],
                            ['icon' => 'contact', 'text' => 'Instant Contact']
                        ]
                    ],
                    'company' => [
                        'name'            => 'vCard',
                        'contact_email'   => 'support@vcard.com',
                        'contact_phone'   => '+1 (555) 123-4567',
                        'contact_address' => 'San Francisco, CA',
                        'logo_light'      => '',
                        'logo_dark'       => ''
                    ],
                    'header' => [
                        'variant'          => 'header1',
                        'background_color' => '#ffffff',
                        'text_color'       => '#1f2937',
                        'navigation_items' => [
                            [
                                'text'   => 'About Us',
                                'type'   => 'page',
                                'href'   => route('directory.custom-page.show', 'about'),
                                'target' => '_self'
                            ],
                            [
                                'text'   => 'Privacy Policy',
                                'type'   => 'page',
                                'href'   => route('directory.custom-page.show', 'privacy-policy'),
                                'target' => '_self'
                            ],
                            [
                                'text'   => 'Terms of Service',
                                'type'   => 'page',
                                'href'   => route('directory.custom-page.show', 'terms-of-service'),
                                'target' => '_self'
                            ],
                            [
                                'text'   => 'Businesses',
                                'type'   => 'link',
                                'href'   => '#businesses',
                                'target' => '_self'
                            ],
                            [
                                'text'   => 'FAQ',
                                'type'   => 'link',
                                'href'   => '#faq',
                                'target' => '_self'
                            ],
                            [
                                'text'   => 'Categories',
                                'type'   => 'link',
                                'href'   => '#categories',
                                'target' => '_self'
                            ],
                        ]
                    ],
                    'footer' => [
                        'description'         => 'Transforming professional networking with innovative digital business cards. Connect, share, and grow your network effortlessly.',
                        'newsletter_title'    => 'Stay Updated with Our Latest Features',
                        'newsletter_subtitle' => 'Join our newsletter for product updates and networking tips',
                        'links'               => [
                            'support' => [
                                ['name' => 'Help Center', 'href' => '#'],
                                ['name' => 'Documentation', 'href' => '#'],
                            ],
                            'legal' => [
                                ['name' => 'Privacy Policy', 'href' => '#'],
                                ['name' => 'Terms of Service', 'href' => '#'],
                            ]
                        ],
                        'social_links' => [
                            ['name' => 'Facebook', 'icon' => 'Facebook', 'href' => '#'],
                            ['name' => 'Twitter', 'icon' => 'Twitter', 'href' => '#']
                        ],
                        'section_titles' => [
                            'support' => 'Support',
                            'legal'   => 'Legal'
                        ]
                    ],
                    'section_order'      => ['hero', 'search', 'categories', 'businesses', 'footer'],
                    'section_visibility' => [
                        'hero'       => true,
                        'search'     => true,
                        'categories' => true,
                        'businesses' => true,
                    ]
                ]
            ]);

            $this->command->info('Business directory settings seeded successfully!');
        } else {
            $this->command->info('Business directory settings already exist.');
        }
    }
}