<?php

namespace App\Providers;

use App\Models\Dispute;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Vehicle;
use App\Models\Verification;
use App\Observers\DisputeObserver;
use App\Observers\PaymentObserver;
use App\Observers\TransactionObserver;
use App\Observers\VehicleObserver;
use App\Observers\VerificationObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Transaction::observe(TransactionObserver::class);
        Vehicle::observe(VehicleObserver::class);
        Dispute::observe(DisputeObserver::class);
        Payment::observe(PaymentObserver::class);
        Verification::observe(VerificationObserver::class);
    }
}
