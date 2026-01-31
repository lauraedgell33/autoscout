<?php

namespace App\Filament\Admin\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                TextInput::make('password')
                    ->password()
                    ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : null)
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $context): bool => $context === 'create')
                    ->maxLength(255),
                TextInput::make('phone')
                    ->tel()
                    ->maxLength(50),
                Select::make('user_type')
                    ->required()
                    ->options([
                        'buyer' => 'Buyer',
                        'seller' => 'Seller',
                        'admin' => 'Admin',
                    ])
                    ->default('buyer'),
                Textarea::make('address')
                    ->rows(2)
                    ->maxLength(500)
                    ->columnSpanFull(),
                TextInput::make('city')
                    ->maxLength(100),
                TextInput::make('postal_code')
                    ->maxLength(20),
                Select::make('country')
                    ->searchable()
                    ->options([
                        'DE' => 'Germany',
                        'AT' => 'Austria',
                        'CH' => 'Switzerland',
                        'FR' => 'France',
                        'IT' => 'Italy',
                        'ES' => 'Spain',
                        'NL' => 'Netherlands',
                        'BE' => 'Belgium',
                        'PL' => 'Poland',
                        'CZ' => 'Czech Republic',
                    ]),
                Select::make('dealer_id')
                    ->label('Dealer')
                    ->relationship('dealer', 'name')
                    ->searchable()
                    ->preload(),
                Toggle::make('is_verified')
                    ->label('Email Verified')
                    ->default(false),
                Select::make('kyc_status')
                    ->label('KYC Status')
                    ->options([
                        'pending' => 'Pending',
                        'submitted' => 'Submitted',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->default('pending'),
                DateTimePicker::make('kyc_verified_at')
                    ->label('KYC Verified At')
                    ->disabled(),
                Select::make('locale')
                    ->options([
                        'en' => 'English',
                        'de' => 'German',
                        'fr' => 'French',
                        'es' => 'Spanish',
                        'it' => 'Italian',
                    ])
                    ->default('en'),
                Select::make('timezone')
                    ->searchable()
                    ->options([
                        'Europe/Berlin' => 'Berlin',
                        'Europe/London' => 'London',
                        'Europe/Paris' => 'Paris',
                        'Europe/Rome' => 'Rome',
                        'Europe/Madrid' => 'Madrid',
                    ])
                    ->default('Europe/Berlin'),
                DateTimePicker::make('last_login_at')
                    ->label('Last Login')
                    ->disabled(),
                TextInput::make('last_login_ip')
                    ->label('Last Login IP')
                    ->disabled(),
            ]);
    }
}
