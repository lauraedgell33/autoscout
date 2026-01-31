<?php

namespace App\Observers;

use App\Models\Dispute;
use App\Models\Payment;
use App\Models\User;
use App\Models\Verification;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;

class AdminNotificationObserver
{
    /**
     * Send notification to all admin users.
     */
    protected function notifyAdmins(string $title, string $body, string $icon = 'heroicon-o-bell', string $color = 'info', ?string $url = null): void
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
