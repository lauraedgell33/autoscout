<?php

namespace App\Filament\Admin\Resources\UserConsents\Pages;

use App\Filament\Admin\Resources\UserConsents\UserConsentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUserConsent extends CreateRecord
{
    protected static string $resource = UserConsentResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Auto-set given_at if consent is given
        if ($data['is_given'] && empty($data['given_at'])) {
            $data['given_at'] = now();
        }

        // Auto-set IP address if not provided
        if (empty($data['ip_address'])) {
            $data['ip_address'] = request()->ip();
        }

        // Auto-set user agent if not provided
        if (empty($data['user_agent'])) {
            $data['user_agent'] = request()->userAgent();
        }

        // Set default consent method if not provided
        if (empty($data['consent_method'])) {
            $data['consent_method'] = 'admin';
        }

        // Clear withdrawal data if consent is being given
        if ($data['is_given']) {
            $data['withdrawn_at'] = null;
            $data['withdrawal_reason'] = null;
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'User consent recorded successfully';
    }
}
