<?php

namespace Database\Seeders;

use App\Models\BusinessDirectoryCustomPage;
use Illuminate\Database\Seeder;

class BusinessDirectoryCustomPageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'About',
                'slug' => 'about',
                'content' => '<div class="space-y-8"><div class="text-center"><h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Business Directory</h2><p class="text-lg text-gray-600 max-w-3xl mx-auto">Your comprehensive platform to discover and connect with verified businesses across various industries.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"><div class="bg-gray-100 rounded-lg p-8 w-full min-h-[220px]"><h3 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3><p class="text-gray-600 leading-relaxed">To connect people with trusted businesses and make discovering professional services simple and efficient.</p></div><div class="bg-gray-100 rounded-lg p-8 w-full min-h-[220px]"><h3 class="text-2xl font-semibold text-gray-900 mb-4">Why List With Us</h3><p class="text-gray-600 leading-relaxed">Increase your visibility, reach more customers, and grow your business with our comprehensive directory platform.</p></div></div></div>',
                'meta_title' => 'About - Business Directory',
                'meta_description' => 'Learn about our business directory platform and how we help connect customers with trusted businesses.',
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'content' => '<div class="space-y-8"><div class="text-center"><h2 class="text-3xl font-bold text-gray-900 mb-4">Privacy &amp; Data Protection</h2><p class="text-lg text-gray-600 max-w-3xl mx-auto">Your privacy matters to us. This policy explains what we collect, how we use it, and how we protect your information on our Business Directory platform.</p></div><div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8"><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h3><p class="text-gray-600 leading-relaxed mb-4">We may collect the following types of information:</p><ul class="list-disc pl-6 space-y-2 text-gray-600"><li>Business profile details</li><li>Contact information</li><li>Website and social links</li><li>Messages and inquiries submitted through the directory</li><li>Usage and analytics data</li></ul></section><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3><p class="text-gray-600 leading-relaxed mb-4">We use collected information to:</p><ul class="list-disc pl-6 space-y-2 text-gray-600"><li>Display and manage business listings</li><li>Respond to user inquiries and requests</li><li>Improve search, visibility, and user experience</li><li>Maintain platform security and performance</li></ul></section><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Information Sharing</h3><p class="text-gray-600 leading-relaxed">We do not sell your personal information. We only share information when needed to operate the directory, comply with legal requirements, or with your permission.</p></section><section><h3 class="text-2xl font-semibold text-gray-900 mb-3">Data Security</h3><p class="text-gray-600 leading-relaxed">We use reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure.</p></section></div></div>',
                'meta_title' => 'Privacy Policy - Business Directory',
                'meta_description' => 'Read our privacy policy to understand how we collect, use, and protect your information on the business directory.',
                'is_active' => true,
                'is_disable' => true,
                'sort_order' => 2
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'content' => '<div class="space-y-8"><div class="text-center"><p class="text-lg text-gray-600 max-w-3xl mx-auto">These terms explain how you may use our Business Directory platform and the responsibilities that apply to users and listed businesses.</p></div><div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8"><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h3><p class="text-gray-600 leading-relaxed">By accessing or using our Business Directory, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p></section><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Business Listings</h3><p class="text-gray-600 leading-relaxed mb-4">If you add or manage a business listing, you agree to:</p><ul class="list-disc pl-6 space-y-2 text-gray-600"><li>Provide accurate, current, and complete information</li><li>Keep your contact details and business data updated</li><li>Not submit misleading, harmful, or unlawful content</li><li>Respect the rights of other users and businesses</li></ul></section><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Platform Usage</h3><p class="text-gray-600 leading-relaxed mb-4">When using the directory, you agree not to:</p><ul class="list-disc pl-6 space-y-2 text-gray-600"><li>Attempt to access restricted areas without permission</li><li>Use automated tools to scrape or abuse the platform</li><li>Interfere with the directory’s security or performance</li><li>Misrepresent your identity or affiliation</li></ul></section><section class="pb-6 border-b border-gray-100"><h3 class="text-2xl font-semibold text-gray-900 mb-3">Suspension and Removal</h3><p class="text-gray-600 leading-relaxed">We reserve the right to suspend, disable, or remove listings or access that violate these terms or harm the directory experience.</p></section><section><h3 class="text-2xl font-semibold text-gray-900 mb-3">Contact</h3><p class="text-gray-600 leading-relaxed">If you have questions about these terms, please contact us using the information provided in the directory footer.</p></section></div></div>',
                'meta_title' => 'Terms of Service - Business Directory',
                'meta_description' => 'Read our terms of service to understand the rules for using our Business Directory platform.',
                'is_active' => true,
                'is_disable' => true,
                'sort_order' => 3
            ],
            [
                'title' => 'FAQ',
                'slug' => 'faq',
                'content' => '<div class="space-y-8"><div class="text-center"><h2 class="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2><p class="text-lg text-gray-600 max-w-3xl mx-auto">Find quick answers to common questions about our Business Directory.</p></div><div class="space-y-4"><div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 class="text-xl font-semibold text-gray-900 mb-3">How do I list my business?</h3><p class="text-gray-600 leading-relaxed">Contact our team to get your business listed in our directory. We will guide you through the process.</p></div><div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 class="text-xl font-semibold text-gray-900 mb-3">Is the directory free to use?</h3><p class="text-gray-600 leading-relaxed">Yes, browsing and searching the directory is completely free for everyone.</p></div><div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 class="text-xl font-semibold text-gray-900 mb-3">How do I update my business information?</h3><p class="text-gray-600 leading-relaxed">Log in to your account and navigate to your business profile to update your information anytime.</p></div><div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 class="text-xl font-semibold text-gray-900 mb-3">Can I contact businesses directly?</h3><p class="text-gray-600 leading-relaxed">Yes, each business listing includes contact information for direct communication.</p></div></div></div>',
                'meta_title' => 'FAQ - Business Directory Help',
                'meta_description' => 'Find answers to frequently asked questions about our Business Directory.',
                'is_active' => true,
                'sort_order' => 4
            ],
        ];

        foreach ($pages as $pageData) {
            $page = BusinessDirectoryCustomPage::firstOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );

            if (in_array($pageData['slug'], ['privacy-policy', 'terms-of-service'], true)) {
                $page->update(['is_disable' => true]);
            }
        }

        $this->command->info('Business directory custom pages seeded successfully!');
    }
}