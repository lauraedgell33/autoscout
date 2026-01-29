<?php

namespace Database\Seeders;

use App\Models\Settings;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Frontend Settings
            [
                'key' => 'frontend_url',
                'value' => 'https://autoscout.dev',
                'type' => 'url',
                'group' => 'frontend',
                'label' => 'Frontend URL',
                'description' => 'Main frontend application URL',
                'is_public' => true,
            ],
            [
                'key' => 'frontend_api_url',
                'value' => 'https://adminautoscout.dev/api',
                'type' => 'url',
                'group' => 'frontend',
                'label' => 'API URL',
                'description' => 'Backend API endpoint',
                'is_public' => true,
            ],
            [
                'key' => 'frontend_logo_url',
                'value' => '/images/logo.png',
                'type' => 'string',
                'group' => 'frontend',
                'label' => 'Logo URL',
                'description' => 'Path to application logo',
                'is_public' => true,
            ],
            [
                'key' => 'frontend_terms_url',
                'value' => '/legal/terms',
                'type' => 'string',
                'group' => 'frontend',
                'label' => 'Terms & Conditions URL',
                'description' => 'Link to terms and conditions page',
                'is_public' => true,
            ],
            [
                'key' => 'frontend_privacy_url',
                'value' => '/legal/privacy',
                'type' => 'string',
                'group' => 'frontend',
                'label' => 'Privacy Policy URL',
                'description' => 'Link to privacy policy page',
                'is_public' => true,
            ],

            // Email Settings
            [
                'key' => 'email_from_address',
                'value' => 'noreply@autoscout.dev',
                'type' => 'email',
                'group' => 'email',
                'label' => 'From Email Address',
                'description' => 'Default sender email address',
                'is_public' => false,
            ],
            [
                'key' => 'email_from_name',
                'value' => 'AutoScout SafePay',
                'type' => 'string',
                'group' => 'email',
                'label' => 'From Name',
                'description' => 'Default sender name',
                'is_public' => false,
            ],
            [
                'key' => 'email_support',
                'value' => 'support@autoscout.dev',
                'type' => 'email',
                'group' => 'email',
                'label' => 'Support Email',
                'description' => 'Email for customer support',
                'is_public' => true,
            ],
            [
                'key' => 'email_admin',
                'value' => 'admin@autoscout.dev',
                'type' => 'email',
                'group' => 'email',
                'label' => 'Admin Email',
                'description' => 'Email for admin notifications',
                'is_public' => false,
            ],
            [
                'key' => 'email_notifications_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'email',
                'label' => 'Enable Email Notifications',
                'description' => 'Master switch for email notifications',
                'is_public' => false,
            ],

            // Contact Settings
            [
                'key' => 'contact_company_name',
                'value' => 'AutoScout SafePay',
                'type' => 'string',
                'group' => 'contact',
                'label' => 'Company Name',
                'description' => 'Legal company name',
                'is_public' => true,
            ],
            [
                'key' => 'contact_address',
                'value' => 'Strada Exemplu, Nr. 123, București, România',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Company Address',
                'description' => 'Physical address',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+40 123 456 789',
                'type' => 'string',
                'group' => 'contact',
                'label' => 'Phone Number',
                'description' => 'Main contact phone',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'contact@autoscout.dev',
                'type' => 'email',
                'group' => 'contact',
                'label' => 'Contact Email',
                'description' => 'General contact email',
                'is_public' => true,
            ],
            [
                'key' => 'contact_working_hours',
                'value' => 'Luni - Vineri: 09:00 - 18:00',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Working Hours',
                'description' => 'Business hours',
                'is_public' => true,
            ],

            // Social Media
            [
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/autoscout',
                'type' => 'url',
                'group' => 'contact',
                'label' => 'Facebook URL',
                'description' => 'Facebook page link',
                'is_public' => true,
            ],
            [
                'key' => 'social_twitter',
                'value' => 'https://twitter.com/autoscout',
                'type' => 'url',
                'group' => 'contact',
                'label' => 'Twitter URL',
                'description' => 'Twitter profile link',
                'is_public' => true,
            ],
            [
                'key' => 'social_linkedin',
                'value' => 'https://linkedin.com/company/autoscout',
                'type' => 'url',
                'group' => 'contact',
                'label' => 'LinkedIn URL',
                'description' => 'LinkedIn page link',
                'is_public' => true,
            ],
            [
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/autoscout',
                'type' => 'url',
                'group' => 'contact',
                'label' => 'Instagram URL',
                'description' => 'Instagram profile link',
                'is_public' => true,
            ],

            // General Settings
            [
                'key' => 'site_name',
                'value' => 'AutoScout SafePay',
                'type' => 'string',
                'group' => 'general',
                'label' => 'Site Name',
                'description' => 'Application name',
                'is_public' => true,
            ],
            [
                'key' => 'site_description',
                'value' => 'Secure payment platform for vehicle transactions',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Site Description',
                'description' => 'Short description of the platform',
                'is_public' => true,
            ],
            [
                'key' => 'maintenance_mode',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'general',
                'label' => 'Maintenance Mode',
                'description' => 'Enable maintenance mode',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Settings::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
