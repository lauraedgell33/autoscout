<?php

namespace Database\Seeders;

use App\Models\LegalDocument;
use Illuminate\Database\Seeder;

class LegalDocumentSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            [
                'type' => LegalDocument::TYPE_TERMS_OF_SERVICE,
                'version' => '1.0',
                'language' => 'en',
                'title' => 'Terms of Service',
                'content' => $this->getTermsOfService(),
                'is_active' => true,
                'effective_date' => now(),
            ],
            [
                'type' => LegalDocument::TYPE_PRIVACY_POLICY,
                'version' => '1.0',
                'language' => 'en',
                'title' => 'Privacy Policy',
                'content' => $this->getPrivacyPolicy(),
                'is_active' => true,
                'effective_date' => now(),
            ],
            [
                'type' => LegalDocument::TYPE_COOKIE_POLICY,
                'version' => '1.0',
                'language' => 'en',
                'title' => 'Cookie Policy',
                'content' => $this->getCookiePolicy(),
                'is_active' => true,
                'effective_date' => now(),
            ],
            [
                'type' => LegalDocument::TYPE_PURCHASE_AGREEMENT,
                'version' => '1.0',
                'language' => 'en',
                'title' => 'Purchase Agreement',
                'content' => $this->getPurchaseAgreement(),
                'is_active' => true,
                'effective_date' => now(),
            ],
            [
                'type' => LegalDocument::TYPE_REFUND_POLICY,
                'version' => '1.0',
                'language' => 'en',
                'title' => 'Refund Policy',
                'content' => $this->getRefundPolicy(),
                'is_active' => true,
                'effective_date' => now(),
            ],
        ];

        foreach ($documents as $document) {
            LegalDocument::create($document);
        }
    }

    private function getTermsOfService(): string
    {
        return "# AutoScout24 SafeTrade - Terms of Service\n\n**Last Updated: January 15, 2026**\n\n## 1. Agreement to Terms\n\nBy accessing AutoScout24 SafeTrade, you agree to these Terms of Service.\n\n## 2. Service Description\n\nVehicle marketplace with escrow payment protection.\n\n## 3. User Obligations\n- Provide accurate information\n- Maintain account security\n- No fraudulent activity\n\n## 4. Transactions\n- Escrow protection provided\n- Platform fees apply\n- Dispute resolution available\n\n## 5. Contact\n\nlegal@autoscout24safetrade.com";
    }

    private function getPrivacyPolicy(): string
    {
        return "# Privacy Policy\n\n**Last Updated: January 15, 2026**\n\n## 1. Information Collection\n\nWe collect: name, email, payment info, KYC documents.\n\n## 2. Usage\n\n- Facilitate transactions\n- Verify identity\n- Prevent fraud\n- Legal compliance\n\n## 3. Your Rights (GDPR)\n\n- Access data\n- Request deletion\n- Data portability\n- Withdraw consent\n\n## 4. Security\n\nEncryption, access controls, secure storage.\n\n## 5. Contact\n\nprivacy@autoscout24safetrade.com";
    }

    private function getCookiePolicy(): string
    {
        return "# Cookie Policy\n\n**Last Updated: January 15, 2026**\n\n## What Are Cookies?\n\nSmall text files on your device.\n\n## Types:\n\n1. Essential - Authentication, security\n2. Performance - Site improvements\n3. Functional - User preferences\n4. Analytics - Usage tracking\n\n## Managing Cookies\n\nControl via browser settings.\n\n## Contact\n\nprivacy@autoscout24safetrade.com";
    }

    private function getPurchaseAgreement(): string
    {
        return "# Vehicle Purchase Agreement\n\n## Parties\n\nBuyer, Seller, Platform (facilitator)\n\n## Payment Process\n\n1. Buyer deposits to escrow\n2. Seller delivers vehicle\n3. Buyer inspects (48 hours)\n4. Funds released on acceptance\n\n## Acceptance Criteria\n\nVehicle matches description, no major undisclosed issues.\n\n## Dispute Resolution\n\nContact support within 48 hours with evidence.\n\n## Contact\n\nsupport@autoscout24safetrade.com";
    }

    private function getRefundPolicy(): string
    {
        return "# Refund Policy\n\n**Last Updated: January 15, 2026**\n\n## Full Refund\n\n- Seller fails to deliver\n- Vehicle not as described\n- Fraudulent listing\n\n## No Refund\n\n- Change of mind\n- After acceptance\n- Disclosed issues\n\n## Process\n\n1. Contact support (48 hours)\n2. Provide evidence\n3. Review (5-10 days)\n4. Resolution within 14 days\n\n## Contact\n\nrefunds@autoscout24safetrade.com";
    }
}
