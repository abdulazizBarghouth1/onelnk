export const defaultLandingPageSections = {
  sections: [
    {
      key: 'header',
      transparent: false,
      background_color: '#ffffff',
      text_color: '#1f2937',
      show_business_directory: true,
      button_style: 'gradient',
      variant: 'header1',
      navigation_items: [
        {
          text: 'Pricing',
          type: 'link',
          href: '#pricing',
          target: '_self'
        },
        {
          text: 'About',
          type: 'page',
          href: '/about-us',
          target: '_self'
        },
        {
          text: 'Privacy Policy',
          type: 'page',
          href: '/privacy-policy',
          target: '_self'
        },
        {
          text: 'Terms of Service',
          type: 'page',
          href: '/terms-of-service',
          target: '_self'
        }
      ]
    },
    {
      key: 'hero',
      title: 'Create Your Digital Business Card in Minutes',
      subtitle: 'Transform your networking with professional digital business cards.',
      announcement_text: '🚀 New: Advanced Analytics Dashboard',
      primary_button_text: 'Start Free Trial',
      primary_button_link: '',
      secondary_button_text: 'Login',
      secondary_button_link: '',
      image: '',
      background_image: '',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      layout: 'image-right',
      overlay: false,
      overlay_color: 'rgba(0,0,0,0.5)',
      card: {
        name: 'John Doe',
        title: 'Senior Developer',
        company: 'Tech Solutions Inc.',
        initials: 'JD'
      }
    },
    {
      key: 'features',
      title: 'Powerful Features for vCard Business Cards',
      description: 'Everything you need to create, share, and manage your digital business presence.',
      background_color: '#ffffff',
      text_color: '#111827',
      image: '',
      show_icons: true,
      features_list: [
        {
          title: 'QR Code Generation',
          description: 'Generate unique QR codes for instant contact sharing.\nLet visitors save your details or open your card in one scan.',
          icon: 'qr-code',
          icon_color: '#3b82f6'
        },
        {
          title: 'NFC Technology',
          description: 'Tap-to-share functionality with NFC-enabled devices.\nMake contact exchange feel fast, modern, and effortless.',
          icon: 'smartphone',
          icon_color: '#3b82f6'
        },
        {
          title: 'Analytics & Insights',
          description: 'Track views, clicks, and engagement metrics.\nUse real data to understand what is working and improve faster.',
          icon: 'bar-chart',
          icon_color: '#3b82f6'
        },
        {
          title: 'Instant Contact Sharing',
          description: 'Let people save your details or open your card in one tap.\nMake networking faster with QR and link sharing.',
          icon: 'share-2',
          icon_color: '#22c55e'
        },
        {
          title: 'Custom Branding',
          description: 'Match your card design to your brand colors, logo, and style.\nKeep every profile looking polished and consistent.',
          icon: 'sparkles',
          icon_color: '#8b5cf6'
        },
        {
          title: 'Secure Profile Access',
          description: 'Protect your card information with a secure digital presence.\nShare only what you want, when you want.',
          icon: 'shield-check',
          icon_color: '#f59e0b'
        }
      ]
    },
    {
      key: 'screenshots',
      title: 'See vCard SaaS in Action',
      subtitle: 'Explore our intuitive interface and powerful features designed to streamline your digital networking experience.',
      background_color: '#ffffff',
      text_color: '#111827',
      screenshots_list: [
        {
          src: 'images/screenshots/hero.png',
          alt: 'vCard SaaS Dashboard Overview',
          title: 'Dashboard Overview',
          description: 'Comprehensive dashboard with all your digital cards and analytics'
        },
        {
          src: 'images/screenshots/vcard-builder.png',
          alt: 'VCard Builder Interface',
          title: 'VCard Builder',
          description: 'Intuitive drag-and-drop builder for creating professional digital cards'
        }
      ]
    },
    {
      key: 'templates',
      title: 'Explore Our Templates',
      subtitle: 'Choose from our professionally designed templates to create your perfect digital business card.',
      background_color: '#f8fafc',
      templates_list: [
        { name: 'freelancer', category: 'professional' },
        { name: 'doctor', category: 'medical' },
        { name: 'restaurant', category: 'food' },
        { name: 'realestate', category: 'business' },
        { name: 'fitness', category: 'health' },
        { name: 'photography', category: 'creative' },
        { name: 'lawfirm', category: 'professional' },
        { name: 'cafe', category: 'food' },
        { name: 'salon', category: 'beauty' },
        { name: 'construction', category: 'business' },
        { name: 'eventplanner', category: 'services' },
        { name: 'tech-startup', category: 'technology' }
      ],
      cta_text: 'View All Templates',
      cta_link: '#'
    },
    {
      key: 'cta',
      title: 'Ready to Get Started?',
      subtitle: 'Create your digital presence in just a few minutes and start sharing your brand with confidence.',
      description: 'Build a polished, professional digital experience that helps you connect faster and convert more visitors.',
      background_color: '#ffffff',
      text_color: '#111827',
      cta_text: 'Contact Us',
      cta_link: '#contact'
    },
    {
      key: 'how_it_works',
      title: 'How vCard Works',
      subtitle: 'Launch your digital business card SaaS, onboard users, and let them share interactive vCards in minutes.',
      background_color: '#f8fafc',
      text_color: '#111827',
      steps_list: [
        { icon: 'database', icon_color: '#3b82f6', title: 'Install / Setup', description: 'Install and configure vCard so your platform is ready for the first launch.' },
        { icon: 'credit-card', icon_color: '#3b82f6', title: 'Set Plan', description: 'Set up pricing plans and payment options for your customers.' },
        { icon: 'users', icon_color: '#22c55e', title: 'User Sign Up', description: 'Users register and create their accounts to access the builder.' },
        { icon: 'layout-grid', icon_color: '#22c55e', title: 'Create Business Card', description: 'Users create their digital business card and add contact details, links, and content.' },
        { icon: 'qr-code', icon_color: '#f59e0b', title: 'Add NFC Card', description: 'Each card gets QR and NFC support for fast, tap-to-share access.' },
        { icon: 'send', icon_color: '#38bdf8', title: 'Share Card', description: 'Users share the card through links, QR codes, or NFC taps.' }
      ]
    },
    {
      key: 'use_cases',
      title: 'Built for people and teams.',
      subtitle: 'Flexible for different business models, from solo creators to growing organizations.',
      background_color: '#f8fafc',
      text_color: '#111827',
      cases_list: [
        {
          title: 'Solo Creators',
          description: 'Perfect for freelancers, consultants, and independent professionals who want a polished digital presence.'
        },
        {
          title: 'Growing Teams',
          description: 'Ideal for small teams that need a shared, consistent way to present their brand and members.'
        },
        {
          title: 'Organizations',
          description: 'Great for larger organizations that need a scalable and easy-to-manage profile system.'
        }
      ]
    },
    {
      key: 'themes',
      title: 'Create a Unified Brand Experience',
      subtitle: 'Keep your landing page, directory, and card previews aligned with one polished brand system.',
      block_title: 'Brand Consistency Made Simple',
      block_subtitle: 'Use one visual style across every vCard page, directory view, and template preview so your product feels seamless everywhere.',
      background_color: '#ffffff',
      text_color: '#111827',
      cta_text: 'Explore Templates',
      cta_link: '/register',
      benefits_list: [
        { value: 'Unified brand identity' },
        { value: 'Flexible theme controls' },
        { value: 'Quick launch for every page' }
      ]
    },
    {
      key: 'about',
      title: 'About vCard SaaS',
      description: 'We are passionate about transforming how professionals connect.',
      story_title: 'Empowering Professional Connections Since 2020',
      story_content: 'Founded by a team of networking enthusiasts and technology experts, vCard SaaS was born from the frustration of outdated paper business cards.',
      image: '',
      background_color: '#f9fafb',
      layout: 'image-right'
    },
    {
      key: 'team',
      title: 'Meet Our Team',
      subtitle: 'We\'re a diverse team of innovators and problem-solvers.',
      background_color: '#ffffff',
      text_color: '#111827',
      cta_title: 'Want to Join Our Team?',
      cta_description: 'We\'re always looking for talented individuals.',
      cta_button_text: 'View Open Positions',
      members: [
        { name: 'Sarah Johnson', role: 'CEO & Founder', bio: 'Former tech executive with 15+ years experience.', image: '', linkedin: '#', email: 'sarah@vCard SaaS.com' }
      ]
    },
    {
      key: 'testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Don\'t just take our word for it.',
      background_color: '#f9fafb',
      text_color: '#111827',
      testimonials: [
        { name: 'Alex Thompson', role: 'Sales Director', image: '', content: 'vCard SaaS has revolutionized how I network.', rating: 5 }
      ]
    },
    {
      key: 'active_campaigns',
      title: 'Featured Business Promotions',
      subtitle: 'Explore businesses we\'re currently promoting and discover amazing services',
      background_color: '#f8fafc',
      background_image: '',
      overlay: false,
      overlay_color: 'rgba(0,0,0,0.5)',
      text_color: '#0f172a',
      show_view_all: true,
      max_display: 6
    },
    {
      key: 'plans',
      title: 'Choose Your Plan',
      subtitle: 'Start with our free plan and upgrade as you grow.',
      background_color: '#ffffff',
      text_color: '#111827',
      faq_text: 'Have questions about our plans? Contact our sales team'
    },
    {
      key: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Got questions? We\'ve got answers.',
      cta_text: 'Still have questions?',
      button_text: 'Contact Support',
      faqs: [
        { question: 'How does vCard SaaS work?', answer: 'vCard SaaS allows you to create digital business cards that can be shared via QR codes.' }
      ]
    },
    {
      key: 'newsletter',
      title: 'Stay Updated with vCard SaaS',
      subtitle: 'Get the latest updates and networking tips.',
      privacy_text: 'No spam, unsubscribe at any time.',
      benefits: [
        { icon: '📧', title: 'Weekly Updates', description: 'Latest features and improvements' }
      ]
    },
    {
      key: 'contact',
      title: 'Get in Touch',
      subtitle: 'Have questions about vCard SaaS? We\'d love to hear from you.',
      form_title: 'Send us a Message',
      info_title: 'Contact Information',
      layout: 'split',
      background_color: '#f9fafb',
      contact_info: {
        email: 'support@vcardsaas.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Suite 100, San Francisco, CA 94105'
      },
      form_fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
        { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us how we can help you', rows: 5 }
      ],
      form_settings: {
        submit_button_text: 'Send Message',
        success_message: 'Thank you for your message! We\'ll get back to you soon.',
        show_privacy_notice: true,
        privacy_notice: 'By submitting this form, you agree to our Privacy Policy.'
      }
    },
    {
      key: 'contact-page',
      title: 'Contact Us',
      description: 'We\'re here to help! Get in touch with our team and we\'ll get back to you as soon as possible.',
      contact_info: {
        email: 'support@vcardsaas.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, Suite 100, San Francisco, CA 94105'
      },
      form_fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: 'Enter your phone number' },
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'What is this about?' },
        { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us how we can help you', rows: 6 }
      ],
      form_settings: {
        submit_button_text: 'Send Message',
        success_message: 'Thank you for contacting us! We\'ll respond within 24 hours.',
        error_message: 'Sorry, there was an error. Please try again or contact us directly.',
        show_privacy_notice: true,
        privacy_notice: 'By submitting this form, you agree to our Privacy Policy and Terms of Service.'
      },
      social_links: [
        { name: 'Facebook', icon: 'facebook', url: '#', show: true },
        { name: 'Twitter', icon: 'twitter', url: '#', show: true },
        { name: 'LinkedIn', icon: 'linkedin', url: '#', show: true },
        { name: 'Instagram', icon: 'instagram', url: '#', show: false }
      ],
      map_settings: {
        show_map: true,
        latitude: 37.7749,
        longitude: -122.4194,
        zoom_level: 15,
        marker_title: 'vCard SaaS Office'
      },
      sections: [
        {
          title: 'Get in Touch',
          content: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
          color: 'blue',
          items: []
        },
        {
          title: 'Contact Information',
          content: 'Reach out to us through any of these channels:',
          color: 'green',
          items: [
            'Email: support@vcard.com',
            'Phone: +1 (555) 123-4567',
            'Address: 123 Business Ave, Suite 100, San Francisco, CA 94105'
          ]
        },
        {
          title: 'Business Hours',
          content: 'Our support team is available during these hours:',
          color: 'purple',
          items: [
            'Monday - Friday: 9:00 AM - 6:00 PM EST',
            'Saturday: 10:00 AM - 4:00 PM EST',
            'Sunday: Closed'
          ]
        }
      ]
    },
    {
      key: 'footer',
      description: 'Transforming professional networking with innovative digital business cards.',
      newsletter_title: 'Stay Updated',
      newsletter_subtitle: 'Join our newsletter for updates',
      links: {
        support: [{ name: 'Help Center', href: '#faq' }, { name: 'Documentation', href: '#contact' }],
        legal: [{ name: 'Privacy Policy', href: '/page/privacy-policy' }, { name: 'Terms of Service', href: '/page/terms-of-service' }]
      },
      social_links: [
        { name: 'Facebook', icon: 'Facebook', href: '#' },
        { name: 'Twitter', icon: 'Twitter', href: '#' }
      ],
      section_titles: {
        support: 'Support',
        legal: 'Legal'
      }
    }
  ],
  theme: {
    primary_color: '#10b77f',
    secondary_color: '#059669',
    accent_color: '#065f46',
    logo_light: '',
    logo_dark: '',
    favicon: ''
  },
  seo: {
    meta_title: 'vCard SaaS - Digital Business Cards',
    meta_description: 'Create professional digital business cards in minutes.',
    meta_keywords: 'digital business cards, networking, QR codes, NFC'
  },
  custom_css: '',
  custom_js: '',
  section_order: ['header', 'hero', 'stats', 'features', 'screenshots', 'templates', 'cta', 'how_it_works', 'use_cases', 'themes', 'about', 'team', 'testimonials', 'active_campaigns', 'plans', 'faq', 'newsletter', 'contact', 'footer'],
  section_visibility: {
    header: true,
    hero: true,
    stats: true,
    features: true,
    screenshots: true,
    templates: true,
    cta: true,
    how_it_works: true,
    use_cases: true,
    themes: true,
    about: true,
    team: true,
    testimonials: true,
    active_campaigns: true,
    plans: true,
    faq: true,
    newsletter: true,
    contact: true,
    footer: true
  }
};
