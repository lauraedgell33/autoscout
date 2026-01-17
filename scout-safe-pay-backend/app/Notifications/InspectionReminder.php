<?php

namespace App\Notifications;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InspectionReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Transaction $transaction,
        public int $hoursRemaining
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $deadline = Carbon::parse($this->transaction->inspection_deadline);
        
        return (new MailMessage)
            ->subject('⏰ Inspection Period Ending Soon - ' . $this->transaction->reference_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('⚠️ **Inspection Period Reminder**')
            ->line('Your inspection period is ending soon. Please take action!')
            ->line('**Transaction:** ' . $this->transaction->reference_number)
            ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
            ->line('**Time Remaining:** ' . $this->hoursRemaining . ' hours')
            ->line('**Deadline:** ' . $deadline->format('l, F j, Y \a\t g:i A'))
            ->line('')
            ->line('**What you need to do:**')
            ->line('1. ✅ **Accept the vehicle** - If everything is as described')
            ->line('2. ⚠️ **Open a dispute** - If you found issues or discrepancies')
            ->line('3. ⏰ **No action** - Payment will be auto-released to seller after deadline')
            ->action('Review Vehicle Now', url('/dashboard/transactions/' . $this->transaction->id . '/inspect'))
            ->line('**Important:** If you don\'t take action before the deadline, the payment will automatically be released to the seller.')
            ->line('Contact support if you need assistance: support@autoscout24-safetrade.com');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'reference_number' => $this->transaction->reference_number,
            'vehicle_id' => $this->transaction->vehicle_id,
            'vehicle_name' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
            'hours_remaining' => $this->hoursRemaining,
            'deadline' => $this->transaction->inspection_deadline,
            'message' => 'Inspection period ending in ' . $this->hoursRemaining . ' hours',
            'type' => 'inspection_reminder',
            'priority' => 'high',
            'url' => '/dashboard/transactions/' . $this->transaction->id . '/inspect'
        ];
    }
}
