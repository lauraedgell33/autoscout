<?php

namespace App\Filament\Admin\Resources\Inquiries\Pages;

use App\Filament\Admin\Resources\Inquiries\InquiryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInquiries extends ListRecords
{
    protected static string $resource = InquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getTitle(): string
    {
        return 'Vehicle Inquiries';
    }

    public function getSubheading(): ?string
    {
        $newCount = \App\Models\Inquiry::where('status', 'new')->count();
        return $newCount > 0 ? "{$newCount} new inquiries waiting for response" : null;
    }
}
