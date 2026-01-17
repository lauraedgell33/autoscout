<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class TransactionsChart extends ChartWidget
{
    protected ?string $heading = 'Transactions Overview';
    
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = $this->getTransactionsPerMonth();
        
        return [
            'datasets' => [
                [
                    'label' => 'Transactions',
                    'data' => $data['values'],
                    'backgroundColor' => '#076FE6',
                    'borderColor' => '#076FE6',
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
    
    private function getTransactionsPerMonth(): array
    {
        $months = collect();
        
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->put($date->format('M Y'), Transaction::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count());
        }
        
        return [
            'labels' => $months->keys()->toArray(),
            'values' => $months->values()->toArray(),
        ];
    }
}
