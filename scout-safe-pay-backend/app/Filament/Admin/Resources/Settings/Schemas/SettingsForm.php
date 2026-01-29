<?php

namespace App\Filament\Admin\Resources\Settings\Schemas;

use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SettingsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Setting Information')
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->helperText('Unique identifier for this setting (e.g., frontend_url)')
                            ->disabled(fn($record) => $record !== null), // Can't change key after creation
                        
                        TextInput::make('label')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Human-readable label displayed in UI'),
                        
                        Textarea::make('description')
                            ->maxLength(500)
                            ->rows(2)
                            ->helperText('Description of what this setting controls'),
                        
                        Select::make('group')
                            ->required()
                            ->options([
                                'general' => 'General',
                                'frontend' => 'Frontend',
                                'email' => 'Email',
                                'contact' => 'Contact',
                                'api' => 'API',
                                'payment' => 'Payment',
                                'security' => 'Security',
                            ])
                            ->native(false)
                            ->helperText('Group this setting belongs to'),
                        
                        Select::make('type')
                            ->required()
                            ->options([
                                'string' => 'String',
                                'text' => 'Text (Long)',
                                'number' => 'Number',
                                'boolean' => 'Boolean',
                                'url' => 'URL',
                                'email' => 'Email',
                                'json' => 'JSON',
                            ])
                            ->native(false)
                            ->reactive()
                            ->helperText('Data type for value validation'),
                        
                        Toggle::make('is_public')
                            ->label('Public Setting')
                            ->helperText('If enabled, this setting will be accessible to frontend')
                            ->default(false),
                    ])
                    ->columns(2),
                
                Section::make('Setting Value')
                    ->schema([
                        // Dynamic value input based on type
                        TextInput::make('value')
                            ->label('Value')
                            ->required()
                            ->maxLength(65535)
                            ->visible(fn($get) => in_array($get('type'), ['string', 'url', 'email', null]))
                            ->type(fn($get) => match($get('type')) {
                                'url' => 'url',
                                'email' => 'email',
                                default => 'text',
                            }),
                        
                        Textarea::make('value')
                            ->label('Value')
                            ->required()
                            ->rows(4)
                            ->visible(fn($get) => in_array($get('type'), ['text', 'json'])),
                        
                        TextInput::make('value')
                            ->label('Value')
                            ->required()
                            ->numeric()
                            ->visible(fn($get) => $get('type') === 'number'),
                        
                        Toggle::make('value')
                            ->label('Value')
                            ->visible(fn($get) => $get('type') === 'boolean')
                            ->formatStateUsing(fn($state) => filter_var($state, FILTER_VALIDATE_BOOLEAN))
                            ->dehydrateStateUsing(fn($state) => $state ? 'true' : 'false'),
                    ]),
            ]);
    }
}
