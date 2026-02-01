<?php

namespace App\Filament\Admin\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Basic Information - full width
                Section::make('Basic Information')
                    ->icon('heroicon-o-user')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('name')
                                ->label('Full Name')
                                ->required()
                                ->maxLength(255)
                                ->placeholder('John Doe'),
                            TextInput::make('email')
                                ->email()
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255)
                                ->placeholder('john@example.com'),
                            TextInput::make('password')
                                ->password()
                                ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : null)
                                ->dehydrated(fn ($state) => filled($state))
                                ->required(fn (string $context): bool => $context === 'create')
                                ->maxLength(255)
                                ->helperText('Leave empty to keep current'),
                            TextInput::make('phone')
                                ->tel()
                                ->maxLength(50)
                                ->placeholder('+49 123 456789'),
                        ]),
                    ])
                    ->columnSpanFull(),

                // Role & Status - full width
                Section::make('Role & Status')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('user_type')
                                ->label('User Type')
                                ->required()
                                ->options([
                                    'buyer' => '🛒 Buyer',
                                    'seller' => '🏷️ Seller',
                                    'dealer' => '🏢 Dealer',
                                    'admin' => '👑 Admin',
                                ])
                                ->default('buyer')
                                ->native(false),
                            Select::make('status')
                                ->label('Account Status')
                                ->options([
                                    'active' => '✅ Active',
                                    'inactive' => '⏸️ Inactive',
                                    'suspended' => '⚠️ Suspended',
                                    'banned' => '🚫 Banned',
                                ])
                                ->default('active')
                                ->native(false),
                            Select::make('dealer_id')
                                ->label('Associated Dealer')
                                ->relationship('dealer', 'name')
                                ->searchable()
                                ->preload()
                                ->placeholder('Select dealer...'),
                            Toggle::make('is_verified')
                                ->label('Email Verified')
                                ->helperText('User has verified their email')
                                ->onColor('success'),
                        ]),
                    ])
                    ->columnSpanFull(),

                // KYC Verification - full width
                Section::make('KYC Verification')
                    ->icon('heroicon-o-identification')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('kyc_status')
                                ->label('KYC Status')
                                ->options([
                                    'pending' => '⏳ Pending',
                                    'submitted' => '📤 Submitted',
                                    'approved' => '✅ Approved',
                                    'rejected' => '❌ Rejected',
                                ])
                                ->default('pending')
                                ->native(false),
                            DateTimePicker::make('kyc_verified_at')
                                ->label('KYC Verified At')
                                ->disabled(),
                            TextInput::make('kyc_id_front')
                                ->label('ID Front URL')
                                ->url()
                                ->disabled(),
                            TextInput::make('kyc_id_back')
                                ->label('ID Back URL')
                                ->url()
                                ->disabled(),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),

                // Address - full width
                Section::make('Address')
                    ->icon('heroicon-o-map-pin')
                    ->schema([
                        Grid::make(4)->schema([
                            Textarea::make('address')
                                ->label('Street Address')
                                ->rows(1)
                                ->maxLength(500)
                                ->placeholder('123 Main Street'),
                            TextInput::make('city')
                                ->maxLength(100)
                                ->placeholder('Berlin'),
                            TextInput::make('postal_code')
                                ->label('Postal Code')
                                ->maxLength(20)
                                ->placeholder('10115'),
                            Select::make('country')
                                ->searchable()
                                ->options([
                                    'DE' => '🇩🇪 Germany',
                                    'AT' => '🇦🇹 Austria',
                                    'CH' => '🇨🇭 Switzerland',
                                    'FR' => '🇫🇷 France',
                                    'IT' => '🇮🇹 Italy',
                                    'ES' => '🇪🇸 Spain',
                                    'NL' => '🇳🇱 Netherlands',
                                    'BE' => '🇧🇪 Belgium',
                                    'PL' => '🇵🇱 Poland',
                                    'CZ' => '🇨🇿 Czech Republic',
                                    'RO' => '🇷🇴 Romania',
                                    'GB' => '🇬🇧 United Kingdom',
                                ])
                                ->native(false),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),

                // Preferences - full width
                Section::make('Preferences')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('locale')
                                ->label('Language')
                                ->options([
                                    'en' => '🇬🇧 English',
                                    'de' => '🇩🇪 German',
                                    'fr' => '🇫🇷 French',
                                    'es' => '🇪🇸 Spanish',
                                    'it' => '🇮🇹 Italian',
                                    'nl' => '🇳🇱 Dutch',
                                    'ro' => '🇷🇴 Romanian',
                                ])
                                ->default('en')
                                ->native(false),
                            Select::make('timezone')
                                ->searchable()
                                ->options([
                                    'Europe/Berlin' => '🇩🇪 Berlin (CET)',
                                    'Europe/London' => '🇬🇧 London (GMT)',
                                    'Europe/Paris' => '🇫🇷 Paris (CET)',
                                    'Europe/Rome' => '🇮🇹 Rome (CET)',
                                    'Europe/Madrid' => '🇪🇸 Madrid (CET)',
                                    'Europe/Amsterdam' => '🇳🇱 Amsterdam (CET)',
                                    'Europe/Bucharest' => '🇷🇴 Bucharest (EET)',
                                ])
                                ->default('Europe/Berlin')
                                ->native(false),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible(),

                // Activity - full width
                Section::make('Activity')
                    ->icon('heroicon-o-clock')
                    ->schema([
                        Grid::make(4)->schema([
                            DateTimePicker::make('created_at')
                                ->label('Registered')
                                ->disabled(),
                            DateTimePicker::make('last_login_at')
                                ->label('Last Login')
                                ->disabled(),
                            TextInput::make('last_login_ip')
                                ->label('Last Login IP')
                                ->disabled(),
                            DateTimePicker::make('updated_at')
                                ->label('Last Updated')
                                ->disabled(),
                        ]),
                    ])
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
