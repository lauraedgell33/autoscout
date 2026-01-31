<?php

namespace App\Filament\Admin\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms;
use Filament\Schemas\Schema;

class ManageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Settings';

    protected static ?string $title = 'Application Settings';

    protected static ?string $slug = 'settings';

    public function getView(): string
    {
        return 'filament.admin.pages.manage-settings';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'System';
    }

    public static function getNavigationSort(): ?int
    {
        return 100;
    }

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Settings')
                    ->tabs([
                        Tab::make('General')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Section::make('Site Information')
                                    ->description('Basic site configuration')
                                    ->schema([
                                        TextInput::make('site_name')
                                            ->label('Site Name')
                                            ->placeholder('AutoScout24 SafeTrade')
                                            ->maxLength(100),
                                        TextInput::make('site_tagline')
                                            ->label('Tagline')
                                            ->placeholder('Secure Vehicle Transactions')
                                            ->maxLength(200),
                                        Textarea::make('site_description')
                                            ->label('Site Description')
                                            ->rows(3)
                                            ->maxLength(500),
                                    ])
                                    ->columns(1),

                                Section::make('URLs')
                                    ->description('Application URLs')
                                    ->schema([
                                        TextInput::make('frontend_url')
                                            ->label('Frontend URL')
                                            ->placeholder('https://yourfrontend.com')
                                            ->url()
                                            ->suffixIcon('heroicon-o-link'),
                                        TextInput::make('backend_url')
                                            ->label('Backend URL')
                                            ->placeholder('https://api.yoursite.com')
                                            ->url()
                                            ->suffixIcon('heroicon-o-link'),
                                        TextInput::make('admin_url')
                                            ->label('Admin URL')
                                            ->placeholder('https://admin.yoursite.com')
                                            ->url()
                                            ->suffixIcon('heroicon-o-link'),
                                    ])
                                    ->columns(1),
                            ]),

                        Tab::make('Contact')
                            ->icon('heroicon-o-phone')
                            ->schema([
                                Section::make('Contact Information')
                                    ->description('Public contact details')
                                    ->schema([
                                        TextInput::make('contact_email')
                                            ->label('Contact Email')
                                            ->email()
                                            ->placeholder('contact@autoscout24-safetrade.de')
                                            ->suffixIcon('heroicon-o-envelope'),
                                        TextInput::make('support_email')
                                            ->label('Support Email')
                                            ->email()
                                            ->placeholder('support@autoscout24-safetrade.de')
                                            ->suffixIcon('heroicon-o-envelope'),
                                        TextInput::make('contact_phone')
                                            ->label('Phone Number')
                                            ->tel()
                                            ->placeholder('+49 89 123 456 789')
                                            ->suffixIcon('heroicon-o-phone'),
                                        TextInput::make('whatsapp_number')
                                            ->label('WhatsApp Number')
                                            ->tel()
                                            ->placeholder('+49 89 123 456 789')
                                            ->suffixIcon('heroicon-o-chat-bubble-left-right'),
                                    ])
                                    ->columns(2),

                                Section::make('Business Address')
                                    ->schema([
                                        TextInput::make('company_name')
                                            ->label('Company Name')
                                            ->placeholder('AutoScout24 SafeTrade GmbH'),
                                        TextInput::make('address_street')
                                            ->label('Street Address')
                                            ->placeholder('Musterstraße 123'),
                                        TextInput::make('address_city')
                                            ->label('City')
                                            ->placeholder('Munich'),
                                        TextInput::make('address_postal_code')
                                            ->label('Postal Code')
                                            ->placeholder('80331'),
                                        TextInput::make('address_country')
                                            ->label('Country')
                                            ->placeholder('Germany'),
                                        TextInput::make('vat_number')
                                            ->label('VAT Number')
                                            ->placeholder('DE123456789'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Email')
                            ->icon('heroicon-o-envelope')
                            ->schema([
                                Section::make('Email Configuration')
                                    ->description('SMTP and email settings')
                                    ->schema([
                                        TextInput::make('mail_from_address')
                                            ->label('From Email Address')
                                            ->email()
                                            ->placeholder('noreply@autoscout24-safetrade.de'),
                                        TextInput::make('mail_from_name')
                                            ->label('From Name')
                                            ->placeholder('AutoScout24 SafeTrade'),
                                        TextInput::make('mail_reply_to')
                                            ->label('Reply-To Address')
                                            ->email()
                                            ->placeholder('support@autoscout24-safetrade.de'),
                                    ])
                                    ->columns(2),

                                Section::make('Email Templates')
                                    ->schema([
                                        Textarea::make('email_footer_text')
                                            ->label('Email Footer Text')
                                            ->rows(3)
                                            ->placeholder('© 2026 AutoScout24 SafeTrade. All rights reserved.'),
                                        Toggle::make('email_include_logo')
                                            ->label('Include Logo in Emails')
                                            ->default(true),
                                    ]),
                            ]),

                        Tab::make('Payments')
                            ->icon('heroicon-o-banknotes')
                            ->schema([
                                Section::make('Bank Details')
                                    ->description('Escrow account information')
                                    ->schema([
                                        TextInput::make('bank_account_holder')
                                            ->label('Account Holder')
                                            ->placeholder('AutoScout24 SafeTrade GmbH'),
                                        TextInput::make('bank_iban')
                                            ->label('IBAN')
                                            ->placeholder('DE89 3704 0044 0532 0130 00'),
                                        TextInput::make('bank_bic')
                                            ->label('BIC/SWIFT')
                                            ->placeholder('COBADEFFXXX'),
                                        TextInput::make('bank_name')
                                            ->label('Bank Name')
                                            ->placeholder('Commerzbank AG'),
                                    ])
                                    ->columns(2),

                                Section::make('Fees & Commissions')
                                    ->schema([
                                        TextInput::make('buyer_fee_percentage')
                                            ->label('Buyer Fee (%)')
                                            ->numeric()
                                            ->step(0.1)
                                            ->suffix('%')
                                            ->placeholder('2.5'),
                                        TextInput::make('seller_fee_percentage')
                                            ->label('Seller Fee (%)')
                                            ->numeric()
                                            ->step(0.1)
                                            ->suffix('%')
                                            ->placeholder('1.5'),
                                        TextInput::make('dealer_commission_percentage')
                                            ->label('Dealer Commission (%)')
                                            ->numeric()
                                            ->step(0.1)
                                            ->suffix('%')
                                            ->placeholder('3.0'),
                                        TextInput::make('minimum_transaction_amount')
                                            ->label('Minimum Transaction (€)')
                                            ->numeric()
                                            ->prefix('€')
                                            ->placeholder('500'),
                                        TextInput::make('maximum_transaction_amount')
                                            ->label('Maximum Transaction (€)')
                                            ->numeric()
                                            ->prefix('€')
                                            ->placeholder('500000'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Social')
                            ->icon('heroicon-o-share')
                            ->schema([
                                Section::make('Social Media Links')
                                    ->schema([
                                        TextInput::make('social_facebook')
                                            ->label('Facebook URL')
                                            ->url()
                                            ->placeholder('https://facebook.com/autoscout24safetrade'),
                                        TextInput::make('social_twitter')
                                            ->label('Twitter/X URL')
                                            ->url()
                                            ->placeholder('https://twitter.com/as24safetrade'),
                                        TextInput::make('social_instagram')
                                            ->label('Instagram URL')
                                            ->url()
                                            ->placeholder('https://instagram.com/autoscout24safetrade'),
                                        TextInput::make('social_linkedin')
                                            ->label('LinkedIn URL')
                                            ->url()
                                            ->placeholder('https://linkedin.com/company/autoscout24-safetrade'),
                                        TextInput::make('social_youtube')
                                            ->label('YouTube URL')
                                            ->url()
                                            ->placeholder('https://youtube.com/@autoscout24safetrade'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Features')
                            ->icon('heroicon-o-puzzle-piece')
                            ->schema([
                                Section::make('Feature Toggles')
                                    ->description('Enable or disable features')
                                    ->schema([
                                        Toggle::make('feature_kyc_verification')
                                            ->label('KYC Verification Required')
                                            ->helperText('Require identity verification for transactions'),
                                        Toggle::make('feature_vehicle_inspection')
                                            ->label('Vehicle Inspection')
                                            ->helperText('Enable vehicle inspection workflow'),
                                        Toggle::make('feature_escrow_payments')
                                            ->label('Escrow Payments')
                                            ->helperText('Use escrow for all transactions'),
                                        Toggle::make('feature_dealer_registration')
                                            ->label('Dealer Registration')
                                            ->helperText('Allow dealers to register'),
                                        Toggle::make('feature_reviews')
                                            ->label('User Reviews')
                                            ->helperText('Enable review system'),
                                        Toggle::make('feature_messaging')
                                            ->label('In-App Messaging')
                                            ->helperText('Allow users to message each other'),
                                        Toggle::make('maintenance_mode')
                                            ->label('Maintenance Mode')
                                            ->helperText('Put the site in maintenance mode'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tab::make('Legal')
                            ->icon('heroicon-o-scale')
                            ->schema([
                                Section::make('Legal Information')
                                    ->schema([
                                        TextInput::make('legal_company_registration')
                                            ->label('Company Registration Number')
                                            ->placeholder('HRB 123456'),
                                        TextInput::make('legal_managing_director')
                                            ->label('Managing Director')
                                            ->placeholder('Max Mustermann'),
                                        TextInput::make('legal_data_protection_officer')
                                            ->label('Data Protection Officer')
                                            ->placeholder('privacy@autoscout24-safetrade.de'),
                                        TextInput::make('legal_supervisory_authority')
                                            ->label('Supervisory Authority')
                                            ->placeholder('Amtsgericht München'),
                                    ])
                                    ->columns(2),
                            ]),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            if ($value !== null) {
                $setting = Setting::where('key', $key)->first();
                
                if ($setting) {
                    $setting->update(['value' => is_bool($value) ? ($value ? '1' : '0') : $value]);
                } else {
                    // Create new setting
                    Setting::create([
                        'group' => $this->getGroupForKey($key),
                        'key' => $key,
                        'value' => is_bool($value) ? ($value ? '1' : '0') : $value,
                        'type' => $this->getTypeForKey($key),
                        'label' => $this->getLabelForKey($key),
                        'is_public' => $this->isPublicKey($key),
                    ]);
                }
            }
        }

        Setting::clearCache();

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }

    protected function getGroupForKey(string $key): string
    {
        $groups = [
            'site_' => 'general',
            'frontend_' => 'general',
            'backend_' => 'general',
            'admin_' => 'general',
            'contact_' => 'contact',
            'support_' => 'contact',
            'company_' => 'contact',
            'address_' => 'contact',
            'vat_' => 'contact',
            'whatsapp_' => 'contact',
            'mail_' => 'email',
            'email_' => 'email',
            'bank_' => 'payments',
            'buyer_' => 'payments',
            'seller_' => 'payments',
            'dealer_' => 'payments',
            'minimum_' => 'payments',
            'maximum_' => 'payments',
            'social_' => 'social',
            'feature_' => 'features',
            'maintenance_' => 'features',
            'legal_' => 'legal',
        ];

        foreach ($groups as $prefix => $group) {
            if (str_starts_with($key, $prefix)) {
                return $group;
            }
        }

        return 'general';
    }

    protected function getTypeForKey(string $key): string
    {
        if (str_starts_with($key, 'feature_') || str_starts_with($key, 'maintenance_') || str_contains($key, '_include_')) {
            return 'boolean';
        }
        
        if (str_contains($key, '_percentage') || str_contains($key, '_amount')) {
            return 'float';
        }
        
        if (str_contains($key, '_text') || str_contains($key, '_description')) {
            return 'text';
        }

        return 'string';
    }

    protected function getLabelForKey(string $key): string
    {
        return ucwords(str_replace('_', ' ', $key));
    }

    protected function isPublicKey(string $key): bool
    {
        $publicKeys = [
            'site_name',
            'site_tagline',
            'site_description',
            'frontend_url',
            'contact_email',
            'contact_phone',
            'company_name',
            'address_street',
            'address_city',
            'address_postal_code',
            'address_country',
            'social_facebook',
            'social_twitter',
            'social_instagram',
            'social_linkedin',
            'social_youtube',
            'buyer_fee_percentage',
            'seller_fee_percentage',
            'feature_kyc_verification',
            'feature_reviews',
        ];

        return in_array($key, $publicKeys);
    }
}
