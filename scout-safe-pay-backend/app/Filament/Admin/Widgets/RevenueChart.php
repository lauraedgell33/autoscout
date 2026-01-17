<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Revenue Trends';
    
    protected static ?int $sort = 3;
    
    protected ?string $pollingInterval = '30s';
    
    public ?string $filter = '30days';

    protected function getData(): array
    {
        $data = $this->getRevenueData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Total Revenue',
                    'data' => $data['revenues'],
                    'borderColor' => '#FF6C0C',
                    'backgroundColor' => 'rgba(255, 108, 12, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
                [
                    'label' => 'Completed',
                    'data' => $data['completed'],
                    'borderColor' => '#16A34A',
                    'backgroundColor' => 'rgba(22, 163, 74, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
    
    protected function getFilters(): ?array
    {
        return [
            '7days' => 'Last 7 days',
            '30days' => 'Last 30 days',
            '3months' => 'Last 3 months',
            'year' => 'This year',
        ];
    }
    
    protected function getRevenueData(): array
    {
        $filter = $this->filter;
        
        $query = Transaction::query();
        
        match ($filter) {
            '7days' => $query->where('created_at', '>=', now()->subDays(7)),
            '30days' => $query->where('created_at', '>=', now()->subDays(30)),
            '3months' => $query->where('created_at', '>=', now()->subMonths(3)),
            'year' => $query->whereYear('created_at', now()->year),
            default => $query->where('created_at', '>=', now()->subDays(30)),
        };
        
        $transactions = $query->get();
        
        $groupedData = match ($filter) {
            '7days' => $transactions->groupBy(fn($t) => Carbon::parse($t->created_at)->format('D')),
            '30days' => $transactions->groupBy(fn($t) => Carbon::parse($t->created_at)->format('d M')),
            '3months' => $transactions->groupBy(fn($t) => Carbon::parse($t->created_at)->format('M Y')),
            'year' => $transactions->groupBy(fn($t) => Carbon::parse($t->created_at)->format('M')),
            default => $transactions->groupBy(fn($t) => Carbon::parse($t->created_at)->format('d M')),
        };
        
        $labels = [];
        $revenues = [];
        $completed = [];
        
        foreach ($groupedData as $label => $items) {
            $labels[] = $label;
            $revenues[] = $items->sum('amount');
            $completed[] = $items->where('status', 'completed')->sum('amount');
        }
        
        return [
            'labels' => $labels,
            'revenues' => $revenues,
            'completed' => $completed,
        ];
    }
}
