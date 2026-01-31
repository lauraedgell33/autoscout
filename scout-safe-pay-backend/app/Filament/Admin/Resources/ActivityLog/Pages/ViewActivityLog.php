<?php

namespace App\Filament\Admin\Resources\ActivityLog\Pages;

use App\Filament\Admin\Resources\ActivityLog\ActivityLogResource;
use Filament\Resources\Pages\ViewRecord;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\TextEntry;
use Filament\Forms;
use Filament\Schemas\Schema;

class ViewActivityLog extends ViewRecord
{
    protected static string $resource = ActivityLogResource::class;

    public function schema(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Activity Details')
                    ->schema([
                        TextEntry::make('log_name')
                            ->label('Type'),
                            
                        TextEntry::make('description')
                            ->label('Action'),
                            
                        TextEntry::make('subject_type')
                            ->formatStateUsing(fn ($state) => class_basename($state))
                            ->label('Model'),
                            
                        TextEntry::make('subject_id')
                            ->label('Model ID'),
                            
                        TextEntry::make('causer.name')
                            ->label('Performed By')
                            ->default('System'),
                            
                        TextEntry::make('causer.email')
                            ->label('User Email')
                            ->default('-'),
                            
                        TextEntry::make('created_at')
                            ->dateTime('l, d F Y - H:i:s')
                            ->label('Date & Time'),
                    ])
                    ->columns(2),
                    
                KeyValue::make('properties')
                    ->label('Changes')
                    ->columnSpanFull(),
            ]);
    }
}
