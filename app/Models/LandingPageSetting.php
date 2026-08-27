<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPageSetting extends Model
{
    protected $fillable = [
        'company_name', 'contact_email', 'contact_phone', 'contact_address', 'config_sections'
    ];
    
    protected $attributes = [
        'company_name' => '',
        'contact_email' => '',
        'contact_phone' => '',
        'contact_address' => ''
    ];

    protected $casts = [
        'config_sections' => 'array'
    ];

    public function save(array $options = [])
    {
        // Remove registrationEnabled before saving
        unset($this->attributes['registrationEnabled']);
        return parent::save($options);
    }

    public function update(array $attributes = [], array $options = [])
    {
        // Remove registrationEnabled from attributes before updating
        unset($attributes['registrationEnabled']);
        return parent::update($attributes, $options);
    }
    public static function getSettings()
    {
        $settings = self::first();
        
        // Import default sections from the template file structure
        $defaultConfig = [
            'sections' => [
                    [
                        'key' => 'header',
                        'transparent' => false,
                        'background_color' => '#ffffff',
                        'text_color' => '#1f2937',
                        'show_business_directory' => false,
                        'variant' => 'header1',
                        'navigation_items' => [
                            ['text' => 'Product', 'type' => 'link', 'href' => '/product', 'target' => '_self'],
                            ['text' => 'Packages', 'type' => 'link', 'href' => '/packages', 'target' => '_self'],
                            ['text' => 'Gallery', 'type' => 'link', 'href' => '/gallery', 'target' => '_self'],
                            ['text' => 'Teams', 'type' => 'link', 'href' => '/teams', 'target' => '_self'],
                            ['text' => 'About', 'type' => 'link', 'href' => '/about', 'target' => '_self'],
                            ['text' => 'Contact', 'type' => 'link', 'href' => '/contact', 'target' => '_self']
                        ]

                    ],
                    [
                        'key' => 'hero',
                        'title' => 'Create Your Digital Business Card in Minutes',
                        'subtitle' => 'Transform your networking with professional digital business cards.',
                        'announcement_text' => '🚀 New: Advanced Analytics Dashboard',
                        'primary_button_text' => 'Start Free Trial',
                        'primary_button_link' => '',
                        'secondary_button_text' => 'Login',
                        'secondary_button_link' => '',
                        'image' => '',
                        'background_image' => '',
                        'background_color' => '#f8fafc',
                        'text_color' => '#1f2937',
                        'layout' => 'image-right',
                        'overlay' => false,
                        'overlay_color' => 'rgba(0,0,0,0.5)',
                        'card' => [
                            'name' => 'John Doe',
                            'title' => 'Senior Developer',
                            'company' => 'Tech Solutions Inc.',
                            'initials' => 'JD'
                        ]
                    ],
                    [
                        'key' => 'stats',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'stats' => [
                            ['value' => '10K+', 'label' => 'Active Users'],
                            ['value' => '99%', 'label' => 'Satisfaction'],
                            ['value' => '50+', 'label' => 'Countries']
                        ]
                    ],
                    [
                        'key' => 'features',
                        'title' => 'Powerful Features for vCard Business Cards',
                        'description' => 'Everything you need to create, share, and manage your digital business presence.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'image' => '',
                        'show_icons' => true,
                        'features_list' => [
                            ['title' => 'QR Code Generation', 'description' => "Generate unique QR codes for instant contact sharing.\nLet visitors save your details or open your card in one scan.", 'icon' => 'qr-code', 'icon_color' => '#3b82f6'],
                            ['title' => 'NFC Technology', 'description' => "Tap-to-share functionality with NFC-enabled devices.\nMake contact exchange feel fast, modern, and effortless.", 'icon' => 'smartphone', 'icon_color' => '#3b82f6'],
                            ['title' => 'Analytics & Insights', 'description' => "Track views, clicks, and engagement metrics.\nUse real data to understand what is working and improve faster.", 'icon' => 'bar-chart', 'icon_color' => '#3b82f6'],
                            ['title' => 'Instant Contact Sharing', 'description' => "Let people save your details or open your card in one tap.\nMake networking faster with QR and link sharing.", 'icon' => 'share-2', 'icon_color' => '#22c55e'],
                            ['title' => 'Custom Branding', 'description' => "Match your card design to your brand colors, logo, and style.\nKeep every profile looking polished and consistent.", 'icon' => 'sparkles', 'icon_color' => '#8b5cf6'],
                            ['title' => 'Secure Profile Access', 'description' => "Protect your card information with a secure digital presence.\nShare only what you want, when you want.", 'icon' => 'shield-check', 'icon_color' => '#f59e0b']
                        ]
                    ],
                    [
                        'key' => 'screenshots',
                        'title' => 'See VCard SaaS in Action',
                        'subtitle' => 'Explore our intuitive interface and powerful features designed to streamline your digital networking experience.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'screenshots_list' => [
                            [
                                'src' => 'images/screenshots/hero.png',
                                'alt' => 'See VCard SaaS Dashboard Overview',
                                'title' => 'Dashboard Overview',
                                'description' => 'Comprehensive dashboard with all your digital cards and analytics'
                            ],
                            [
                                'src' => 'images/screenshots/vcard-builder.png',
                                'alt' => 'VCard Builder Interface',
                                'title' => 'VCard Builder',
                                'description' => 'Intuitive drag-and-drop builder for creating professional digital cards'
                            ],
                            [
                                'src' => 'images/screenshots/analytics.png',
                                'alt' => 'VCard Builder Interface',
                                'title' => 'VCard Analytics',
                                'description' => 'Comprehensive dashboard with all your digital cards and analytics.'
                            ]
                        ]
                    ],
                    [
                        'key' => 'templates',
                        'title' => 'Explore Our Templates',
                        'subtitle' => 'Choose from our professionally designed templates to create your perfect digital business card.',
                        'background_color' => '#f8fafc',
                        'templates_list' => [
                            ['name' => 'freelancer', 'category' => 'professional'],
                            ['name' => 'doctor', 'category' => 'medical'],
                            ['name' => 'restaurant', 'category' => 'food'],
                            ['name' => 'realestate', 'category' => 'business'],
                            ['name' => 'fitness', 'category' => 'health'],
                            ['name' => 'photography', 'category' => 'creative'],
                            ['name' => 'lawfirm', 'category' => 'professional'],
                            ['name' => 'cafe', 'category' => 'food'],
                            ['name' => 'salon', 'category' => 'beauty'],
                            ['name' => 'construction', 'category' => 'business'],
                            ['name' => 'eventplanner', 'category' => 'services'],
                            ['name' => 'tech-startup', 'category' => 'technology']
                        ],
                        'cta_text' => 'View All Templates',
                        'cta_link' => '#'
                    ],
                    [
                        'key' => 'cta',
                        'title' => 'Ready to create',
                        'subtitle' => 'your smart business card?',
                        'description' => 'Build a polished, professional digital experience that helps you connect faster and convert more visitors.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'cta_text' => 'Contact Us',
                        'cta_link' => '#contact'
                    ],
                    [
                        'key' => 'how_it_works',
                        'title' => 'How vCard Works',
                        'subtitle' => 'Launch your digital business card SaaS, onboard users, and let them share interactive vCards in minutes.',
                        'background_color' => '#f8fafc',
                        'text_color' => '#111827',
                        'steps_list' => [
                            ['icon' => 'database', 'icon_color' => '#3b82f6', 'title' => 'Install / Setup', 'description' => 'Install and configure vCard so your platform is ready for the first launch.'],
                            ['icon' => 'credit-card', 'icon_color' => '#3b82f6', 'title' => 'Set Plan', 'description' => 'Set up pricing plans and payment options for your customers.'],
                            ['icon' => 'users', 'icon_color' => '#22c55e', 'title' => 'User Sign Up', 'description' => 'Users register and create their accounts to access the builder.'],
                            ['icon' => 'layout-grid', 'icon_color' => '#22c55e', 'title' => 'Create Business Card', 'description' => 'Users create their digital business card and add contact details, links, and content.'],
                            ['icon' => 'qr-code', 'icon_color' => '#f59e0b', 'title' => 'Add NFC Card', 'description' => 'Each card gets QR and NFC support for fast, tap-to-share access.'],
                            ['icon' => 'send', 'icon_color' => '#38bdf8', 'title' => 'Share Card', 'description' => 'Users share the card through links, QR codes, or NFC taps.']
                        ]
                    ],
                    [
                        'key' => 'use_cases',
                        'title' => 'Built for people and teams.',
                        'subtitle' => 'Flexible for different business models, from solo creators to growing organizations.',
                        'background_color' => '#f8fafc',
                        'text_color' => '#111827',
                        'cases_list' => [
                            ['title' => 'Solo Creators', 'description' => 'Perfect for freelancers, consultants, and independent professionals who want a polished digital presence.'],
                            ['title' => 'Growing Teams', 'description' => 'Ideal for small teams that need a shared, consistent way to present their brand and members.'],
                            ['title' => 'Organizations', 'description' => 'Great for larger organizations that need a scalable and easy-to-manage profile system.']
                        ]
                    ],
                    [
                        'key' => 'themes',
                        'title' => 'Create a Unified Brand Experience',
                        'subtitle' => 'Keep your landing page, directory, and card previews aligned with one polished brand system.',
                        'block_title' => 'Brand Consistency Made Simple',
                        'block_subtitle' => 'Use one visual style across every vCard page, directory view, and template preview so your product feels seamless everywhere.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'cta_text' => 'Explore Templates',
                        'cta_link' => '/register',
                        'benefits_list' => [
                            ['value' => 'Unified brand identity'],
                            ['value' => 'Flexible theme controls'],
                            ['value' => 'Quick launch for every page']
                        ]
                    ],
                    [
                        'key' => 'team',
                        'title' => 'Meet Our Team',
                        'subtitle' => 'We\'re a diverse team of innovators and problem-solvers.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'cta_title' => 'Want to Join Our Team?',
                        'cta_description' => 'We\'re always looking for talented individuals.',
                        'cta_button_text' => 'View Open Positions',
                        'members' => [
                                ['name' => 'Sarah Johnson', 'role' => 'CEO & Founder', 'bio' => 'Former tech executive with 15+ years experience.', 'image' => '', 'linkedin' => '#', 'email' => 'sarah@vcard.com'],
                                ['name' => 'Michael Carter', 'role' => 'CTO', 'bio' => 'Full-stack engineer with a passion for scalable systems and modern web technologies.', 'image' => '', 'linkedin' => '#', 'email' => 'michael@vcard.com'],
                                ['name' => 'Emily Davis', 'role' => 'Head of Design', 'bio' => 'Creative designer with 10+ years crafting beautiful and intuitive user experiences.', 'image' => '', 'linkedin' => '#', 'email' => 'emily@vcard.com'],
                                ['name' => 'James Wilson', 'role' => 'Marketing Manager', 'bio' => 'Growth-focused marketer helping businesses reach their audience effectively.', 'image' => '', 'linkedin' => '#', 'email' => 'james@vcard.com']
                            ]
                    ],
                    [
                        'key' => 'testimonials',
                        'title' => 'What Our Clients Say',
                        'subtitle' => 'Don\'t just take our word for it.',
                        'background_color' => '#f9fafb',
                        'text_color' => '#111827',
                        'testimonials' => [
                            ['name' => 'Alex Thompson', 'role' => 'Sales Director', 'image' => '', 'content' => 'vCard SaaS has revolutionized how I network.', 'rating' => 5],
                            ['name' => 'Maria Garcia', 'role' => 'Marketing Manager', 'image' => '', 'content' => 'Amazing vCard system! Extremely easy to customize and works perfectly on all devices. Highly recommended!', 'rating' => 5],
                            ['name' => 'James Wilson', 'role' => 'Entrepreneur', 'image' => '', 'content' => 'Great product with clean design and smooth performance. I received the full source code and setup took just a few minutes.', 'rating' => 5]
                        ]
                    ],
                    [
                        'key' => 'active_campaigns',
                        'title' => 'Featured Business Promotions',
                        'subtitle' => 'Explore businesses we\'re currently promoting and discover amazing services',
                        'background_color' => '#f8fafc',
                        'background_image' => '',
                        'overlay' => false,
                        'overlay_color' => 'rgba(0,0,0,0.5)',
                        'text_color' => '#0f172a',
                        'show_view_all' => true,
                        'max_display' => 6
                    ],
                    [
                        'key' => 'plans',
                        'title' => 'Choose Your Plan',
                        'subtitle' => 'Start with our free plan and upgrade as you grow.',
                        'background_color' => '#ffffff',
                        'text_color' => '#111827',
                        'faq_text' => 'Have questions about our plans? Contact our sales team'
                    ],
                    [
                        'key' => 'faq',
                        'title' => 'Frequently Asked Questions',
                        'subtitle' => 'Got questions? We\'ve got answers.',
                        'cta_text' => 'Still have questions?',
                        'button_text' => 'Contact Support',
                        'faqs' => [
                            ['question' => 'How does vCard SaaS work?', 'answer' => 'vCard SaaS allows you to create digital business cards that can be shared via QR codes.'],
                            ['question' => 'Will I get the full source code of the vCard system?', 'answer' => 'Yes, you will receive the complete source code, and you can modify it as needed.'],
                            ['question' => 'Is this a one-time payment or subscription?', 'answer' => 'It is a one-time payment, and you will receive lifetime free updates.']
                        ]
                    ],
                    [
                        'key' => 'newsletter',
                        'title' => 'Stay Updated with vCard SaaS',
                        'subtitle' => 'Get the latest updates and networking tips.',
                        'privacy_text' => 'No spam, unsubscribe at any time.',
                        'benefits' => [
                            ['icon' => '📧', 'title' => 'Weekly Updates', 'description' => 'Latest features and improvements'],
                            ['icon' => '🔄', 'title' => 'Increased User Engagement', 'description' => 'Regular updates keep users active, interested, and connected to your brand.'],
                            ['icon' => '🚀', 'title' => 'Promote New Features', 'description' => 'Easily share product improvements, new releases, and important announcements.']
                        ]
                    ],
                    [
                        'key' => 'contact',
                        'title' => 'Get in Touch',
                        'subtitle' => 'Have questions about vCard? We\'d love to hear from you.',
                        'form_title' => 'Send us a Message',
                        'info_title' => 'Contact Information',
                        'layout' => 'split',
                        'background_color' => '#f9fafb'
                    ],
                    [
                        'key' => 'footer',
                        'description' => 'Transforming professional networking with innovative digital business cards.',
                        'newsletter_title' => 'Stay Updated',
                        'newsletter_subtitle' => 'Join our newsletter for updates',
                        'links' => [
                            'support' => [['name' => 'Help Center', 'href' => '#'], ['name' => 'Documentation', 'href' => '#'], ['name' => 'API Reference', 'href' => '#'], ['name' => 'Status', 'href' => '#']],
                            'legal' => [['name' => 'Privacy Policy', 'href' => '/page/privacy-policy'], ['name' => 'Terms & Conditions', 'href' => '/page/terms-of-service'], ['name' => 'Shipping Policy', 'href' => '/page/shipping-policy']]
                        ],
                        'social_links' => [
                            ['name' => 'Facebook', 'icon' => 'Facebook', 'href' => '#'],
                            ['name' => 'Twitter', 'icon' => 'Twitter', 'href' => '#'],
                            ['name' => 'LinkedIn', 'icon' => 'Linkedin', 'href' => '#'],
                            ['name' => 'Instagram', 'icon' => 'Instagram', 'href' => '#']
                        ],
                        'section_titles' => [
                            'support' => 'Support',
                            'legal' => 'Legal'
                        ]
                    ]
            ],
            'theme' => [
                'primary_color' => '#10b77f',
                'secondary_color' => '#059669',
                'accent_color' => '#065f46',
                'logo_light' => '',
                'logo_dark' => '',
                'favicon' => ''
            ],
            'seo' => [
                'meta_title' => 'vCard SaaS - Digital Business Cards',
                'meta_description' => 'Create professional digital business cards in minutes.',
                'meta_keywords' => 'digital business cards, networking, QR codes, NFC'
            ],
            'custom_css' => '',
            'custom_js' => '',
            'section_order' => ['header', 'hero', 'stats', 'features', 'screenshots', 'templates', 'cta', 'how_it_works', 'use_cases', 'themes', 'about', 'team', 'testimonials', 'active_campaigns', 'plans', 'faq', 'newsletter', 'contact', 'footer'],
            'section_visibility' => [
                'header' => true,
                'hero' => true,
                'features' => true,
                'screenshots' => true,
                'stats' => true,
                'templates' => true,
                'cta' => true,
                'how_it_works' => true,
                'use_cases' => true,
                'themes' => true,
                'team' => true,
                'testimonials' => true,
                'active_campaigns' => true,
                'plans' => true,
                'faq' => true,
                'newsletter' => true,
                'contact' => true,
                'footer' => true
            ]
        ];
        
        if (!$settings) {
            $settings = self::create([
                'company_name'    => 'vCard',
                'contact_email'   => 'support@vcard.com',
                'contact_phone'   => '+1 (555) 123-4567',
                'contact_address' => 'San Francisco, CA',
                'config_sections' => $defaultConfig,
            ]);
        } else {
            // Sync missing sections from top defaultConfig for existing clients
            $config = $settings->config_sections;
            $existingSections = $config['sections'] ?? [];
            $existingKeys = array_column($existingSections, 'key');
            
            // Get sections from main defaultConfig defined above
            foreach ($defaultConfig['sections'] as $section) {
                if (!in_array($section['key'], $existingKeys)) {
                    $existingSections[] = $section;
                    if (!in_array($section['key'], $config['section_order'] ?? [])) {
                        $config['section_order'][] = $section['key'];
                    }
                    if (!isset($config['section_visibility'][$section['key']])) {
                        $config['section_visibility'][$section['key']] = true;
                    }
                }
            }
            
            $config['sections'] = $existingSections;
            $settings->config_sections = $config;
            $settings->save();
        }

        // Add registration setting from global settings
        $settings->registrationEnabled = getSetting('registrationEnabled', true);

        return $settings;
    }
}
