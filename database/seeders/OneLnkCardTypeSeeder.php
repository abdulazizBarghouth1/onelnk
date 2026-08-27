<?php

namespace Database\Seeders;

use App\Models\NfcCard;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * The three card types the create-card wizard sells: Classic, Custom, Teams.
 * Idempotent (updateOrCreate by name) so it is safe to re-run. Prices/stock
 * and copy are admin-editable afterwards via the NFC cards screen.
 */
class OneLnkCardTypeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->warn('No users found — skipping OneLnk card types.');
            return;
        }

        $types = [
            [
                'name' => 'Classic Card',
                'description' => 'A premium PVC business card with built-in NFC that shares your digital profile with one tap. Clean, pre-designed templates — ready to ship.',
                'price' => 29.00,
                'compare_price' => 39.00,
                'quantity' => 500,
                'tags' => ['Individuals', 'Freelancers', 'Consultants', 'Quick Orders'],
                'features' => ['Digital profile', 'Basic Link Sharing', 'Standard card finish'],
                'front_image' => 'images/onelnk/s5-classic.png',
                'back_image' => 'images/onelnk/wz-card-back.svg',
            ],
            [
                'name' => 'Custom Card',
                'description' => 'Full control over your card branding — colours, logo, and layout — paired with an expanded digital profile. The complete premium package.',
                'price' => 49.00,
                'compare_price' => 69.00,
                'quantity' => 300,
                'tags' => ['Personal Brands', 'Creatives', 'Premium Users'],
                'features' => ['Digital profile', 'PVC NFC card', 'Custom card design', 'More profile sections', 'Priority design options'],
                'front_image' => 'images/onelnk/s5-custom.png',
                'back_image' => 'images/onelnk/wz-card-back.svg',
            ],
            [
                'name' => 'Teams Card',
                'description' => 'Branded NFC cards for your whole team, managed from one dashboard — consistent company branding, bulk ordering, and centralized control.',
                'price' => 39.00,
                'compare_price' => 49.00,
                'quantity' => 1000,
                'tags' => ['Sales Teams', 'Corporate Dept.', 'Business'],
                'features' => ['Multiple employee cards', 'Company branding', 'Team management', 'Bulk order', 'Centralized control'],
                'front_image' => 'images/onelnk/s5-teams.png',
                'back_image' => 'images/onelnk/wz-card-back.svg',
            ],
        ];

        foreach ($types as $type) {
            NfcCard::updateOrCreate(
                ['name' => $type['name']],
                array_merge($type, [
                    'is_enabled' => true,
                    'created_by' => $user->id,
                ])
            );
        }

        $this->command->info('OneLnk card types (Classic / Custom / Teams) seeded.');
    }
}
