<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;

class TransactionSuccessRate extends ChartWidget
{
    protected ?string $heading = 'Transaction Success Rate';
    
    protected static ?int $sort = 5;
    
    public ?string $filter = 'all';

    protected function getData(): array
    {
        $data = $this->getSuccessRateData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Transactions',
                    'data' => $data['values'],
                    'backgroundColor' => [
                        '#16A34A', // Completed - Green
                        '#3B82F6', // Payment Verified - Blue
                        '#F59E0B', // Payment Pending - Amber
                        '#6B7280', // Pending - Gray
                        '#EF4444', // Cancelled - Red
                    ],
                    'hoverOffset' => 4,
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
    
    protected function getFilters(): ?array
    {
        return [
            'all' => 'All Time',
            'month' => 'This Month',
            'week' => 'This Week',
            'today' => 'Today',
        ];
    }
    
    protected function getSuccessRateData(): array
    {
        $query = Transaction::query();
        
        match ($this->filter) {
            'today' => $query->whereDate('created_at', today()),
            'week' => $query->where('created_at', '>=', now()->startOfWeek()),
            'month' => $query->whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year),
            default => null,
        };
        
        $statusCounts = $query->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
        
        $labels = [];
        $values = [];
        
        $statusOrder = [
            'completed' => 'Completed',
            'payment_verified' => 'Payment Verified',
            'payment_pending' => 'Payment Pending',
            'pending' => 'Pending',
            'cancelled' => 'Cancelled',
        ];
        
        foreach ($statusOrder as $key => $label) {
            if (isset($statusCounts[$key]) && $statusCounts[$key] > 0) {
                $labels[] = $label . ' (' . $statusCounts[$key] . ')';
                $values[] = $statusCounts[$key];
            }
        }
        
        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }
    
    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'position' => 'bottom',
                ],
            ],
        ];
    }
}
