<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;

class PaymentMethodsChart extends ChartWidget
{
    protected ?string $heading = 'Payment Methods Distribution';
    
    protected static ?int $sort = 6;

    protected function getData(): array
    {
        $data = $this->getPaymentMethodsData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Payments',
                    'data' => $data['values'],
                    'backgroundColor' => [
                        '#3B82F6', // Bank Transfer - Blue
                        '#16A34A', // Credit Card - Green
                        '#F59E0B', // PayPal - Amber
                        '#8B5CF6', // Stripe - Purple
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
        $methodCounts = Payment::selectRaw('payment_method, count(*) as count, sum(amount) as total')
            ->groupBy('payment_method')
            ->get();
        
        $labels = [];
        $values = [];
        
        foreach ($methodCounts as $method) {
            $methodName = match($method->payment_method) {
                'bank_transfer' => 'Bank Transfer',
                'credit_card' => 'Credit Card',
                'paypal' => 'PayPal',
                'stripe' => 'Stripe',
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
