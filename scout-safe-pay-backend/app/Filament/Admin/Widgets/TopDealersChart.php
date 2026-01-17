<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Dealer;
use App\Models\Transaction;
use Filament\Widgets\ChartWidget;

class TopDealersChart extends ChartWidget
{
    protected ?string $heading = 'Top 10 Dealers by Revenue';
    
    protected static ?int $sort = 4;
    
    public ?string $filter = 'revenue';

    protected function getData(): array
    {
        $data = $this->getTopDealersData();
        
        return [
            'datasets' => [
                [
                    'label' => $this->filter === 'revenue' ? 'Revenue (€)' : 'Transactions',
                    'data' => $data['values'],
                    'backgroundColor' => [
                        '#FF6C0C', '#16A34A', '#3B82F6', '#F59E0B', '#EF4444',
                        '#8B5CF6', '#EC4899', '#10B981', '#F97316', '#6366F1',
                    ],
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
    
    protected function getFilters(): ?array
    {
        return [
            'revenue' => 'By Revenue',
            'transactions' => 'By Transactions',
            'completed' => 'By Completed',
        ];
    }
    
    protected function getTopDealersData(): array
    {
        $dealers = Dealer::with('users.transactionsAsSeller')
            ->where('status', 'active')
            ->get()
            ->map(function ($dealer) {
                $transactions = Transaction::whereHas('seller', function ($query) use ($dealer) {
                    $query->where('dealer_id', $dealer->id);
                })->get();
                
                return [
                    'name' => $dealer->name,
                    'revenue' => $transactions->where('status', 'completed')->sum('amount'),
                    'transactions' => $transactions->count(),
                    'completed' => $transactions->where('status', 'completed')->count(),
                ];
            });
        
        $sortBy = match ($this->filter) {
            'revenue' => 'revenue',
            'transactions' => 'transactions',
            'completed' => 'completed',
            default => 'revenue',
        };
        
        $topDealers = $dealers->sortByDesc($sortBy)->take(10);
        
        return [
            'labels' => $topDealers->pluck('name')->toArray(),
            'values' => $topDealers->pluck($sortBy)->toArray(),
        ];
    }
    
    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
            'scales' => [
                'x' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}
