<?php

namespace App\Observers;

use App\Models\Payment;
use App\Models\User;
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action;

class PaymentObserver
{
    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        if ($payment->isDirty('status') && $payment->status === 'failed') {
            $this->notifyAdmins(
                'Payment Failed',
                "Payment #{$payment->payment_reference} of €" . number_format($payment->amount, 2) . " has failed",
                'heroicon-o-x-circle',
                'danger',
                route('filament.admin.resources.payments.edit', $payment)
            );
        }

        // Notify for large payments requiring review
        if ($payment->isDirty('status') && $payment->status === 'pending' && $payment->amount >= 50000) {
            $this->notifyAdmins(
                'Large Payment Pending',
                "A payment of €" . number_format($payment->amount, 2) . " requires review",
                'heroicon-o-banknotes',
                'warning',
                route('filament.admin.resources.payments.edit', $payment)
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
