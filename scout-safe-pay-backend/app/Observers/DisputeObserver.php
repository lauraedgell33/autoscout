<?php

namespace App\Observers;

use App\Models\Dispute;
use App\Models\User;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;

class DisputeObserver
{
    /**
     * Handle the Dispute "created" event.
     */
    public function created(Dispute $dispute): void
    {
        $this->notifyAdmins(
            'New Dispute Opened',
            "A new dispute has been raised for transaction #{$dispute->transaction_id}",
            'heroicon-o-exclamation-triangle',
            'danger',
            route('filament.admin.resources.disputes.view', $dispute)
        );
    }

    /**
     * Handle the Dispute "updated" event.
     */
    public function updated(Dispute $dispute): void
    {
        if ($dispute->isDirty('status') && $dispute->status === 'escalated') {
            $this->notifyAdmins(
                'Dispute Escalated',
                "Dispute #{$dispute->id} has been escalated and requires immediate attention",
                'heroicon-o-exclamation-circle',
                'danger',
                route('filament.admin.resources.disputes.view', $dispute)
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
