<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use App\Models\Business;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('type', 'company')->take(3)->get();
        $businesses = Business::take(5)->get();

        if ($users->isEmpty() || $businesses->isEmpty()) {
            $this->command->warn('No users or businesses found. Please seed users and businesses first.');
            return;
        }

        $campaigns = [
            [
                'user_id' => $users->first()->id,
                'business_id' => $businesses->first()->id,
                'name' => 'Summer Sale Campaign',
                'description' => 'Promote summer products and services',
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(35),
                'total_days' => 30,
                'total_amount' => 450.00,
                'payment_method' => 'stripe',
                'status' => 'active',
                'is_active' => true,
                'campaign_data' => ['target_audience' => 'young adults', 'budget_allocation' => 'social_media'],
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'user_id' => $users->skip(1)->first()->id,
                'business_id' => $businesses->skip(1)->first()->id,
                'name' => 'Holiday Special',
                'description' => 'Holiday season promotional campaign',
                'start_date' => Carbon::now()->addDays(10),
                'end_date' => Carbon::now()->addDays(25),
                'total_days' => 15,
                'total_amount' => 225.00,
                'payment_method' => 'paypal',
                'status' => 'pending',
                'is_active' => true,
                'campaign_data' => ['target_audience' => 'families', 'budget_allocation' => 'email_marketing'],
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'user_id' => $users->last()->id,
                'business_id' => $businesses->skip(2)->first()->id,
                'name' => 'New Product Launch',
                'description' => 'Launch campaign for new product line',
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addDays(20),
                'total_days' => 30,
                'total_amount' => 600.00,
                'payment_method' => 'razorpay',
                'status' => 'active',
                'is_active' => true,
                'campaign_data' => ['target_audience' => 'professionals', 'budget_allocation' => 'google_ads'],
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'user_id' => $users->first()->id,
                'business_id' => $businesses->skip(3)->first()->id ?? $businesses->first()->id,
                'name' => 'Back to School Promo',
                'description' => 'Special offers targeting students and parents',
                'start_date' => Carbon::now()->subDays(20),
                'end_date' => Carbon::now()->subDays(5),
                'total_days' => 16,
                'total_amount' => 320.00,
                'payment_method' => 'bank',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'students', 'budget_allocation' => 'display_ads'],
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $users->skip(1)->first()->id ?? $users->first()->id,
                'business_id' => $businesses->skip(4)->first()->id ?? $businesses->skip(1)->first()->id ?? $businesses->first()->id,
                'name' => 'Festival Promotion Blast',
                'description' => 'Seasonal marketing push for festive deals and limited-time discounts',
                'start_date' => Carbon::now()->addDays(3),
                'end_date' => Carbon::now()->addDays(18),
                'total_days' => 16,
                'total_amount' => 280.00,
                'payment_method' => 'stripe',
                'status' => 'pending',
                'is_active' => true,
                'campaign_data' => ['target_audience' => 'festival_shoppers', 'budget_allocation' => 'sms_marketing'],
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $users->last()->id,
                'business_id' => $businesses->skip(2)->first()->id ?? $businesses->first()->id,
                'name' => 'Flash Weekend Offer',
                'description' => 'Short campaign focused on rapid conversions over the weekend',
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(4),
                'total_days' => 7,
                'total_amount' => 140.00,
                'payment_method' => 'paypal',
                'status' => 'active',
                'is_active' => true,
                'campaign_data' => ['target_audience' => 'repeat_customers', 'budget_allocation' => 'whatsapp'],
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDay(),
            ],
            [
                'user_id' => $users->skip(1)->first()->id ?? $users->first()->id,
                'business_id' => $businesses->skip(1)->first()->id ?? $businesses->first()->id,
                'name' => 'Brand Awareness Drive',
                'description' => 'A cancelled awareness campaign intended to expand local reach',
                'start_date' => Carbon::now()->subDays(12),
                'end_date' => Carbon::now()->subDays(2),
                'total_days' => 11,
                'total_amount' => 210.00,
                'payment_method' => 'razorpay',
                'status' => 'cancelled',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'local_audience', 'budget_allocation' => 'video_ads'],
                'created_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $users->first()->id,
                'business_id' => $businesses->first()->id,
                'name' => 'Winter Clearance Campaign',
                'description' => 'Clearance discounts to move seasonal inventory before spring',
                'start_date' => Carbon::now()->subMonths(1)->startOfMonth()->addDays(3),
                'end_date' => Carbon::now()->subMonths(1)->startOfMonth()->addDays(18),
                'total_days' => 16,
                'total_amount' => 260.00,
                'payment_method' => 'stripe',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'discount_seekers', 'budget_allocation' => 'social_media'],
                'created_at' => Carbon::now()->subMonths(1)->startOfMonth()->addDays(3),
                'updated_at' => Carbon::now()->subMonths(1)->startOfMonth()->addDays(18),
            ],
            [
                'user_id' => $users->skip(1)->first()->id ?? $users->first()->id,
                'business_id' => $businesses->skip(1)->first()->id ?? $businesses->first()->id,
                'name' => 'New Year Launch Push',
                'description' => 'Promotional campaign focused on new year service signups',
                'start_date' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(5),
                'end_date' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(24),
                'total_days' => 20,
                'total_amount' => 390.00,
                'payment_method' => 'paypal',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'new_customers', 'budget_allocation' => 'email_marketing'],
                'created_at' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(5),
                'updated_at' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(24),
            ],
            [
                'user_id' => $users->last()->id,
                'business_id' => $businesses->skip(2)->first()->id ?? $businesses->first()->id,
                'name' => 'Valentine Special Promo',
                'description' => 'Short-term promotion designed for event-based bookings and offers',
                'start_date' => Carbon::now()->subMonths(3)->startOfMonth()->addDays(7),
                'end_date' => Carbon::now()->subMonths(3)->startOfMonth()->addDays(20),
                'total_days' => 14,
                'total_amount' => 230.00,
                'payment_method' => 'bank',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'couples', 'budget_allocation' => 'instagram_ads'],
                'created_at' => Carbon::now()->subMonths(3)->startOfMonth()->addDays(7),
                'updated_at' => Carbon::now()->subMonths(3)->startOfMonth()->addDays(20),
            ],
            [
                'user_id' => $users->first()->id,
                'business_id' => $businesses->skip(3)->first()->id ?? $businesses->first()->id,
                'name' => 'Spring Collection Teaser',
                'description' => 'Awareness campaign to introduce upcoming spring collection',
                'start_date' => Carbon::now()->subMonths(4)->startOfMonth()->addDays(2),
                'end_date' => Carbon::now()->subMonths(4)->startOfMonth()->addDays(16),
                'total_days' => 15,
                'total_amount' => 275.00,
                'payment_method' => 'razorpay',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'fashion_buyers', 'budget_allocation' => 'display_ads'],
                'created_at' => Carbon::now()->subMonths(4)->startOfMonth()->addDays(2),
                'updated_at' => Carbon::now()->subMonths(4)->startOfMonth()->addDays(16),
            ],
            [
                'user_id' => $users->skip(1)->first()->id ?? $users->first()->id,
                'business_id' => $businesses->skip(4)->first()->id ?? $businesses->skip(1)->first()->id ?? $businesses->first()->id,
                'name' => 'Monsoon Service Reminder',
                'description' => 'Retention campaign targeting returning customers with seasonal offers',
                'start_date' => Carbon::now()->subMonths(5)->startOfMonth()->addDays(4),
                'end_date' => Carbon::now()->subMonths(5)->startOfMonth()->addDays(21),
                'total_days' => 18,
                'total_amount' => 310.00,
                'payment_method' => 'stripe',
                'status' => 'completed',
                'is_active' => false,
                'campaign_data' => ['target_audience' => 'existing_customers', 'budget_allocation' => 'google_ads'],
                'created_at' => Carbon::now()->subMonths(5)->startOfMonth()->addDays(4),
                'updated_at' => Carbon::now()->subMonths(5)->startOfMonth()->addDays(21),
            ]
        ];

        foreach ($campaigns as $campaignData) {
            Campaign::create($campaignData);
        }

        $this->command->info('Campaigns seeded successfully!');
    }
}
