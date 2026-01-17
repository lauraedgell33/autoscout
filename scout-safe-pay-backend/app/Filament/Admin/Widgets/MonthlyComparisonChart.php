<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class MonthlyComparisonChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Performance';
    
    protected static ?int $sort = 7;
    
    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $currentYear = now()->year;
        $previousYear = $currentYear - 1;
        
        $currentYearData = $this->getYearData($currentYear);
        $previousYearData = $this->getYearData($previousYear);
        
        return [
            'datasets' => [
                [
                    'label' => $currentYear . ' Revenue',
                    'data' => $currentYearData['revenue'],
                    'borderColor' => '#FF6C0C',
                    'backgroundColor' => 'rgba(255, 108, 12, 0.1)',
                    'fill' => true,
                ],
                [
                    'label' => $previousYear . ' Revenue',
                    'data' => $previousYearData['revenue'],
                    'borderColor' => '#6B7280',
                    'backgroundColor' => 'rgba(107, 114, 128, 0.1)',
                    'fill' => true,
                    'borderDash' => [5, 5],
                ],
                [
                    'label' => $currentYear . ' Transactions',
                    'data' => $currentYearData['count'],
                    'borderColor' => '#16A34A',
                    'backgroundColor' => 'rgba(22, 163, 74, 0.1)',
                    'yAxisID' => 'y1',
                ],
            ],
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
    
    protected function getYearData(int $year): array
    {
        $months = range(1, 12);
        $revenue = [];
        $count = [];
        
        foreach ($months as $month) {
            $transactions = Transaction::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->get();
            
            $revenue[] = $transactions->where('status', 'completed')->sum('amount');
            $count[] = $transactions->count();
        }
        
        return [
            'revenue' => $revenue,
            'count' => $count,
        ];
    }
    
    protected function getOptions(): array
    {
        return [
            'interaction' => [
                'intersect' => false,
                'mode' => 'index',
            ],
            'scales' => [
                'y' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'left',
                    'title' => [
                        'display' => true,
                        'text' => 'Revenue (€)',
                    ],
                ],
                'y1' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'right',
                    'title' => [
                        'display' => true,
                        'text' => 'Transactions',
                    ],
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                ],
            ],
        ];
    }
}
