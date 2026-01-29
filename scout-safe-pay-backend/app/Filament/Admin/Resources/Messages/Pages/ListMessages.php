<?php

namespace App\Filament\Admin\Resources\Messages\Pages;

use App\Filament\Admin\Resources\Messages\MessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListMessages extends ListRecords
{
    protected static string $resource = MessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->badge(fn () => \App\Models\Message::count()),
            
            'unread' => Tab::make('Unread')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_read', false))
                ->badge(fn () => \App\Models\Message::where('is_read', false)->count())
                ->badgeColor('warning'),
            
            'read' => Tab::make('Read')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_read', true))
                ->badge(fn () => \App\Models\Message::where('is_read', true)->count())
                ->badgeColor('success'),
            
            'system' => Tab::make('System Messages')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_system_message', true))
                ->badge(fn () => \App\Models\Message::where('is_system_message', true)->count())
                ->badgeColor('primary'),
            
            'user' => Tab::make('User Messages')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_system_message', false))
                ->badge(fn () => \App\Models\Message::where('is_system_message', false)->count())
                ->badgeColor('info'),
            
            'with_attachments' => Tab::make('With Attachments')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereNotNull('attachments')->where('attachments', '!=', '[]'))
                ->badge(fn () => \App\Models\Message::whereNotNull('attachments')->where('attachments', '!=', '[]')->count())
                ->badgeColor('info'),
        ];
    }
}
