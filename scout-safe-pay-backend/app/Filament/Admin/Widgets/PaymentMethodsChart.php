<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;

class PaymentMethodsChart extends ChartWidget
{
    protected ?string $heading = 'Payment Types Distribution';
    
    protected static ?int $sort = 6;

    protected function getData(): array
    {
        $data = $this->getPaymentMethodsData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Payment Types',
                    'data' => $data['values'],
                    'backgroundColor' => [
                        '#3B82F6', // Deposit - Blue
                        '#16A34A', // Release - Green
                        '#F59E0B', // Refund - Amber
                        '#EF4444', // Service Fee - Red
                        '#8B5CF6', // Dealer Commission - Purple
                        '#6B7280', // Other - Gray
                    ],
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
    
    protected function getPaymentMethodsData(): array
    {
        $methodCounts = Payment::selectRaw('type, count(*) as count, sum(amount) as total')
            ->groupBy('type')
            ->get();
        
        $labels = [];
        $values = [];
        
        foreach ($methodCounts as $method) {
            $methodName = match($method->type) {
                'deposit' => 'Deposit',
                'release' => 'Release',
                'refund' => 'Refund',
                'service_fee' => 'Service Fee',
                'dealer_commission' => 'Dealer Commission',
                default => 'Other',
            };
            
            $labels[] = $methodName . ' (€' . number_format($method->total, 0) . ')';
            $values[] = $method->count;
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
                    'position' => 'right',
                ],
            ],
        ];
    }
}
