import { Head, usePage } from '@inertiajs/react';
import CookieConsent from "@/components/cookie-consent";
import { useFavicon } from '@/hooks/use-favicon';
import DirectoryHeader from '../components/DirectoryHeader';
import DirectoryFooter from '../components/DirectoryFooter';

interface CustomPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
}

interface DirectorySettings {
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    title?: string;
    description?: string;
    config_sections?: {
        theme?: {
            primary_color?: string;
            secondary_color?: string;
            accent_color?: string;
        };
        company?: {
            name?: string;
            contact_email?: string;
            contact_phone?: string;
            contact_address?: string;
            description?: string;
        };
        hero?: any;
        footer?: {
            description?: string;
            newsletter_title?: string;
            newsletter_subtitle?: string;
            links?: any;
            social_links?: any[];
            section_titles?: any;
        };
    };
}

interface ShowProps {
    page: CustomPage;
    settings?: DirectorySettings;
    customPages?: CustomPage[];
}

export default function Show({ page, settings, customPages = [] }: ShowProps) {
    const { adminAllSetting } = usePage().props as any;
    useFavicon();

    const colorScheme = settings?.config_sections?.theme || {
        primary_color: '#3b82f6',
        secondary_color: '#8b5cf6',
        accent_color: '#10b77f'
    };
    const brandColor = colorScheme.primary_color || '#3b82f6';
    const textColor = '#1f2937';
    
    return (
        <div className="min-h-screen bg-white" style={{
            '--color-primary': colorScheme.primary_color,
            '--color-secondary': colorScheme.secondary_color,
            '--color-accent': colorScheme.accent_color
        } as React.CSSProperties}>
            <Head title={page.meta_title || page.title}>
                {page.meta_description && <meta name="description" content={page.meta_description} />}
            </Head>

            <DirectoryHeader
                key="header"
                settings={settings as any}
                directorySettings={settings}
                sectionData={settings?.config_sections?.header || {}}
                brandColor={brandColor}
                textColor={textColor}
            />

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                            {page.title}
                        </h1>
                    </div>

                    <div className="prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1">
                        <div
                            dangerouslySetInnerHTML={{ __html: page.content }}
                            className="text-gray-700 leading-relaxed"
                        />
                    </div>
                </div>
            </section>

            <DirectoryFooter
                key="footer"
                settings={settings as any}
                directorySettings={settings}
                sectionData={settings?.config_sections?.footer || {}}
                brandColor={brandColor}
            />

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}
