<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;

class TransactionStatusChart extends ChartWidget
{
    protected static ?string $heading = 'Transaction Status Distribution';
    
    protected static ?int $sort = 3;
    
    protected static ?string $pollingInterval = '60s';
    
    protected static ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $statuses = [
            'completed' => Transaction::where('status', 'completed')->count(),
            'pending' => Transaction::where('status', 'pending')->count(),
            'escrow' => Transaction::where('status', 'escrow')->count(),
            'processing' => Transaction::where('status', 'processing')->count(),
            'failed' => Transaction::where('status', 'failed')->count(),
            'cancelled' => Transaction::where('status', 'cancelled')->count(),
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Transactions',
                    'data' => array_values($statuses),
                    'backgroundColor' => [
                        'rgb(34, 197, 94)',   // completed - green
                        'rgb(251, 191, 36)',  // pending - yellow
                        'rgb(59, 130, 246)',  // escrow - blue
                        'rgb(168, 85, 247)',  // processing - purple
                        'rgb(239, 68, 68)',   // failed - red
                        'rgb(107, 114, 128)', // cancelled - gray
                    ],
                ],
            ],
            'labels' => array_map('ucfirst', array_keys($statuses)),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'bottom',
                ],
            ],
        ];
    }
}
