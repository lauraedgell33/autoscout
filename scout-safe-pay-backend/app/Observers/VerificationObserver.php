<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Verification;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;

class VerificationObserver
{
    /**
     * Handle the Verification "created" event.
     */
    public function created(Verification $verification): void
    {
        if ($verification->type === 'identity') {
            $this->notifyAdmins(
                'New KYC Verification',
                "User {$verification->user->name} has submitted identity verification",
                'heroicon-o-identification',
                'warning',
                route('filament.admin.resources.verifications.view', $verification)
            );
        }
    }

    /**
     * Send notification to all admin users.
     */
    protected function notifyAdmins(string $title, string $body, string $icon, string $color, ?string $url = null): void
    {
        $admins = User::where('user_type', 'admin')->get();

        foreach ($admins as $admin) {
            $notification = Notification::make()
                ->title($title)
                ->body($body)
                ->icon($icon)
                ->color($color);

            if ($url) {
                $notification->actions([
                    Action::make('view')
                        ->label('View')
                        ->url($url)
                        ->markAsRead(),
                ]);
            }

            $notification->sendToDatabase($admin);
        }
    }
}
