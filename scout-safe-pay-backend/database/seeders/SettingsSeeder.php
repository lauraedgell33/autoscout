<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['group' => 'general', 'key' => 'site_name', 'value' => 'AutoScout24 SafeTrade', 'type' => 'string', 'label' => 'Site Name', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_tagline', 'value' => 'Secure Vehicle Transactions', 'type' => 'string', 'label' => 'Tagline', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_description', 'value' => 'The safest way to buy and sell vehicles online with escrow protection.', 'type' => 'text', 'label' => 'Site Description', 'is_public' => true],
            ['group' => 'general', 'key' => 'frontend_url', 'value' => 'http://localhost:3002', 'type' => 'string', 'label' => 'Frontend URL', 'is_public' => true],
            ['group' => 'general', 'key' => 'backend_url', 'value' => 'http://localhost:8000', 'type' => 'string', 'label' => 'Backend URL', 'is_public' => false],
            ['group' => 'general', 'key' => 'admin_url', 'value' => 'http://localhost:8000/admin', 'type' => 'string', 'label' => 'Admin URL', 'is_public' => false],

            // Contact
            ['group' => 'contact', 'key' => 'contact_email', 'value' => 'contact@autoscout24-safetrade.de', 'type' => 'string', 'label' => 'Contact Email', 'is_public' => true],
            ['group' => 'contact', 'key' => 'support_email', 'value' => 'support@autoscout24-safetrade.de', 'type' => 'string', 'label' => 'Support Email', 'is_public' => true],
            ['group' => 'contact', 'key' => 'contact_phone', 'value' => '+49 89 123 456 789', 'type' => 'string', 'label' => 'Phone Number', 'is_public' => true],
            ['group' => 'contact', 'key' => 'whatsapp_number', 'value' => '+49 89 123 456 789', 'type' => 'string', 'label' => 'WhatsApp Number', 'is_public' => true],
            ['group' => 'contact', 'key' => 'company_name', 'value' => 'AutoScout24 SafeTrade GmbH', 'type' => 'string', 'label' => 'Company Name', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_street', 'value' => 'Musterstraße 123', 'type' => 'string', 'label' => 'Street Address', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_city', 'value' => 'Munich', 'type' => 'string', 'label' => 'City', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_postal_code', 'value' => '80331', 'type' => 'string', 'label' => 'Postal Code', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_country', 'value' => 'Germany', 'type' => 'string', 'label' => 'Country', 'is_public' => true],
            ['group' => 'contact', 'key' => 'vat_number', 'value' => 'DE123456789', 'type' => 'string', 'label' => 'VAT Number', 'is_public' => true],

            // Email
            ['group' => 'email', 'key' => 'mail_from_address', 'value' => 'noreply@autoscout24-safetrade.de', 'type' => 'string', 'label' => 'From Email Address', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_from_name', 'value' => 'AutoScout24 SafeTrade', 'type' => 'string', 'label' => 'From Name', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_reply_to', 'value' => 'support@autoscout24-safetrade.de', 'type' => 'string', 'label' => 'Reply-To Address', 'is_public' => false],
            ['group' => 'email', 'key' => 'email_footer_text', 'value' => '© 2026 AutoScout24 SafeTrade. All rights reserved.', 'type' => 'text', 'label' => 'Email Footer Text', 'is_public' => false],
            ['group' => 'email', 'key' => 'email_include_logo', 'value' => '1', 'type' => 'boolean', 'label' => 'Include Logo in Emails', 'is_public' => false],

            // Payments
            ['group' => 'payments', 'key' => 'bank_account_holder', 'value' => 'AutoScout24 SafeTrade GmbH', 'type' => 'string', 'label' => 'Account Holder', 'is_public' => false],
            ['group' => 'payments', 'key' => 'bank_iban', 'value' => 'DE89 3704 0044 0532 0130 00', 'type' => 'string', 'label' => 'IBAN', 'is_public' => false],
            ['group' => 'payments', 'key' => 'bank_bic', 'value' => 'COBADEFFXXX', 'type' => 'string', 'label' => 'BIC/SWIFT', 'is_public' => false],
            ['group' => 'payments', 'key' => 'bank_name', 'value' => 'Commerzbank AG', 'type' => 'string', 'label' => 'Bank Name', 'is_public' => false],
            ['group' => 'payments', 'key' => 'buyer_fee_percentage', 'value' => '2.5', 'type' => 'float', 'label' => 'Buyer Fee (%)', 'is_public' => true],
            ['group' => 'payments', 'key' => 'seller_fee_percentage', 'value' => '1.5', 'type' => 'float', 'label' => 'Seller Fee (%)', 'is_public' => true],
            ['group' => 'payments', 'key' => 'dealer_commission_percentage', 'value' => '3.0', 'type' => 'float', 'label' => 'Dealer Commission (%)', 'is_public' => false],
            ['group' => 'payments', 'key' => 'minimum_transaction_amount', 'value' => '500', 'type' => 'float', 'label' => 'Minimum Transaction (€)', 'is_public' => true],
            ['group' => 'payments', 'key' => 'maximum_transaction_amount', 'value' => '500000', 'type' => 'float', 'label' => 'Maximum Transaction (€)', 'is_public' => true],

            // Social
            ['group' => 'social', 'key' => 'social_facebook', 'value' => 'https://facebook.com/autoscout24safetrade', 'type' => 'string', 'label' => 'Facebook URL', 'is_public' => true],
            ['group' => 'social', 'key' => 'social_twitter', 'value' => 'https://twitter.com/as24safetrade', 'type' => 'string', 'label' => 'Twitter/X URL', 'is_public' => true],
            ['group' => 'social', 'key' => 'social_instagram', 'value' => 'https://instagram.com/autoscout24safetrade', 'type' => 'string', 'label' => 'Instagram URL', 'is_public' => true],
            ['group' => 'social', 'key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/autoscout24-safetrade', 'type' => 'string', 'label' => 'LinkedIn URL', 'is_public' => true],
            ['group' => 'social', 'key' => 'social_youtube', 'value' => '', 'type' => 'string', 'label' => 'YouTube URL', 'is_public' => true],

            // Features
            ['group' => 'features', 'key' => 'feature_kyc_verification', 'value' => '1', 'type' => 'boolean', 'label' => 'KYC Verification Required', 'is_public' => true],
            ['group' => 'features', 'key' => 'feature_vehicle_inspection', 'value' => '1', 'type' => 'boolean', 'label' => 'Vehicle Inspection', 'is_public' => true],
            ['group' => 'features', 'key' => 'feature_escrow_payments', 'value' => '1', 'type' => 'boolean', 'label' => 'Escrow Payments', 'is_public' => true],
            ['group' => 'features', 'key' => 'feature_dealer_registration', 'value' => '1', 'type' => 'boolean', 'label' => 'Dealer Registration', 'is_public' => true],
            ['group' => 'features', 'key' => 'feature_reviews', 'value' => '1', 'type' => 'boolean', 'label' => 'User Reviews', 'is_public' => true],
            ['group' => 'features', 'key' => 'feature_messaging', 'value' => '1', 'type' => 'boolean', 'label' => 'In-App Messaging', 'is_public' => true],
            ['group' => 'features', 'key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean', 'label' => 'Maintenance Mode', 'is_public' => true],

            // Legal
            ['group' => 'legal', 'key' => 'legal_company_registration', 'value' => 'HRB 123456', 'type' => 'string', 'label' => 'Company Registration Number', 'is_public' => true],
            ['group' => 'legal', 'key' => 'legal_managing_director', 'value' => 'Max Mustermann', 'type' => 'string', 'label' => 'Managing Director', 'is_public' => true],
            ['group' => 'legal', 'key' => 'legal_data_protection_officer', 'value' => 'privacy@autoscout24-safetrade.de', 'type' => 'string', 'label' => 'Data Protection Officer', 'is_public' => true],
            ['group' => 'legal', 'key' => 'legal_supervisory_authority', 'value' => 'Amtsgericht München', 'type' => 'string', 'label' => 'Supervisory Authority', 'is_public' => true],
        ];

        foreach ($settings as $index => $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                array_merge($setting, ['sort_order' => $index])
            );
        }

        echo "✅ Settings seeded successfully!\n";
    }
}
