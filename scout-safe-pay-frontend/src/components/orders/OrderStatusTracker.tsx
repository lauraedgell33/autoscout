'use client';

import React from 'react';
import { CheckCircle, Circle, Clock, FileText, Upload, CreditCard, Package, Truck, Star } from 'lucide-react';

interface OrderStatusTrackerProps {
  currentStatus: string;
  createdAt?: string;
  contractGeneratedAt?: string;
  contractSignedAt?: string;
  paymentConfirmedAt?: string;
  readyForDeliveryAt?: string;
  deliveredAt?: string;
}

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  statusKey?: keyof OrderStatusTrackerProps;
}

export default function OrderStatusTracker({
  currentStatus,
  createdAt,
  contractGeneratedAt,
  contractSignedAt,
  paymentConfirmedAt,
  readyForDeliveryAt,
  deliveredAt,
}: OrderStatusTrackerProps) {
  
  const steps: Step[] = [
    {
      id: 'pending',
      label: 'Order Created',
      icon: <FileText size={24} />,
      description: 'Your order has been placed',
      statusKey: 'createdAt',
    },
    {
      id: 'contract_generated',
      label: 'Contract Generated',
      icon: <FileText size={24} />,
      description: 'Purchase contract is ready',
      statusKey: 'contractGeneratedAt',
    },
    {
      id: 'contract_signed',
      label: 'Contract Signed',
      icon: <Upload size={24} />,
      description: 'Contract signed and uploaded',
      statusKey: 'contractSignedAt',
    },
    {
      id: 'payment_verified',
      label: 'Payment Confirmed',
      icon: <CreditCard size={24} />,
      description: 'Payment received and verified',
      statusKey: 'paymentConfirmedAt',
    },
    {
      id: 'ready_for_delivery',
      label: 'Ready for Delivery',
      icon: <Package size={24} />,
      description: 'Vehicle prepared for delivery',
      statusKey: 'readyForDeliveryAt',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: <Truck size={24} />,
      description: 'Vehicle delivered successfully',
      statusKey: 'deliveredAt',
    },
  ];

  const statusHierarchy = [
    'draft',
    'pending',
    'contract_generated',
    'contract_signed',
    'awaiting_bank_transfer',
    'payment_submitted',
    'payment_verified',
    'paid',
    'invoice_issued',
    'ready_for_delivery',
    'delivered',
    'completed',
  ];

  const currentIndex = statusHierarchy.indexOf(currentStatus);

  const getStepStatus = (stepId: string, index: number): 'completed' | 'current' | 'upcoming' => {
    const stepStatusIndex = statusHierarchy.indexOf(stepId);
    
    if (currentIndex > stepStatusIndex || currentIndex >= index) {
      return 'completed';
    }
    if (currentIndex === stepStatusIndex || currentIndex === index - 1) {
      return 'current';
    }
    return 'upcoming';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Progress</h2>

      {/* Desktop View - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id, index);
              const dateKey = step.statusKey;
              const timestamp = dateKey ? (
                dateKey === 'createdAt' ? createdAt :
                dateKey === 'contractGeneratedAt' ? contractGeneratedAt :
                dateKey === 'contractSignedAt' ? contractSignedAt :
                dateKey === 'paymentConfirmedAt' ? paymentConfirmedAt :
                dateKey === 'readyForDeliveryAt' ? readyForDeliveryAt :
                dateKey === 'deliveredAt' ? deliveredAt :
                undefined
              ) : undefined;

              return (
                <div key={step.id} className="flex flex-col items-center" style={{ width: '16.666%' }}>
                  {/* Icon Circle */}
                  <div
                    className={`
                      relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all
                      ${status === 'completed' ? 'bg-orange-500 border-orange-500 text-white' : ''}
                      ${status === 'current' ? 'bg-white border-orange-500 text-orange-500 ring-4 ring-orange-100' : ''}
                      ${status === 'upcoming' ? 'bg-white border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle size={28} />
                    ) : status === 'current' ? (
                      <Clock size={28} className="animate-pulse" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p className={`
                      font-semibold text-sm
                      ${status === 'completed' ? 'text-gray-900' : ''}
                      ${status === 'current' ? 'text-orange-600' : ''}
                      ${status === 'upcoming' ? 'text-gray-500' : ''}
                    `}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                    {timestamp && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Vertical */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const dateKey = step.statusKey;
          const timestamp = dateKey ? (
            dateKey === 'createdAt' ? createdAt :
            dateKey === 'contractGeneratedAt' ? contractGeneratedAt :
            dateKey === 'contractSignedAt' ? contractSignedAt :
            dateKey === 'paymentConfirmedAt' ? paymentConfirmedAt :
            dateKey === 'readyForDeliveryAt' ? readyForDeliveryAt :
            dateKey === 'deliveredAt' ? deliveredAt :
            undefined
          ) : undefined;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all
                    ${status === 'completed' ? 'bg-orange-500 border-orange-500 text-white' : ''}
                    ${status === 'current' ? 'bg-white border-orange-500 text-orange-500 ring-4 ring-orange-100' : ''}
                    ${status === 'upcoming' ? 'bg-white border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {status === 'completed' ? (
                    <CheckCircle size={20} />
                  ) : status === 'current' ? (
                    <Clock size={20} className="animate-pulse" />
                  ) : (
                    <Circle size={20} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-1 flex-1 min-h-[40px] ${
                      status === 'completed' ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <p className={`
                  font-semibold
                  ${status === 'completed' ? 'text-gray-900' : ''}
                  ${status === 'current' ? 'text-orange-600' : ''}
                  ${status === 'upcoming' ? 'text-gray-500' : ''}
                `}>
                  {step.label}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {step.description}
                </p>
                {timestamp && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status Banner */}
      <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm text-orange-900 font-medium">Current Status:</p>
            <p className="text-lg font-bold text-orange-600">
              {steps.find(s => getStepStatus(s.id, steps.indexOf(s)) === 'current')?.label || 'Processing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
