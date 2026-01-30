/**
 * Bank Transfer Payment API Routes
 * Handles bank transfer payment processing (No Stripe - EU Compliant)
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { APIErrorHandler } from '@/lib/error-handler';

/**
 * POST /api/payments/initiate-transfer
 * Initiate a bank transfer payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'EUR',
      transactionId,
      buyerId,
      sellerId,
      description,
      bankDetails,
    } = body;

    // Validate required fields
    if (!amount || !transactionId) {
      return NextResponse.json(
        {
          error: 'Missing required fields: amount, transactionId',
        },
        { status: 400 }
      );
    }

    // Validate amount (must be > 0)
    if (amount <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid amount. Must be greater than 0.',
        },
        { status: 400 }
      );
    }

    // Create bank transfer request through backend
    const response = await apiClient.post('/api/transactions/{id}/upload-payment-proof', {
      transactionId,
      amount,
      currency,
      paymentMethod: 'bank_transfer',
      buyerId,
      sellerId,
      description,
      bankDetails,
    });

    return NextResponse.json({
      success: true,
      transactionId: (response as any).data?.transactionId,
      status: 'bank_transfer_pending',
      amount,
      currency,
      message: 'Bank transfer initiated. Please complete the transfer to the provided account.',
    });
  } catch (error) {
    console.error('Error initiating bank transfer:', error);
    const parsed = APIErrorHandler.parseError(error);
    return NextResponse.json(
      {
        error: APIErrorHandler.getUserMessage(error),
        statusCode: parsed.statusCode,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/bank-details
 * Get bank details for transfer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get transaction details and bank details from backend
    const response = await apiClient.get(
      `/api/transactions/${transactionId}`
    );

    // Extract bank details (seller's bank account)
    const bankDetails = (response as any).data?.sellerBankAccount || null;

    return NextResponse.json({
      transactionId,
      bankDetails,
      status: (response as any).data?.status,
      amount: (response as any).data?.amount,
      currency: (response as any).data?.currency || 'EUR',
      reference: `${transactionId}-${new Date().getTime()}`,
      message: 'Please transfer the amount to the provided bank account. Use the reference above.',
    });
  } catch (error) {
    console.error('Error retrieving bank details:', error);
    const parsed = APIErrorHandler.parseError(error);
    return NextResponse.json(
      {
        error: APIErrorHandler.getUserMessage(error),
        statusCode: parsed.statusCode,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/payments/verify-transfer
 * Verify a bank transfer has been completed
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, proofOfPayment } = body;

    if (!transactionId || !proofOfPayment) {
      return NextResponse.json(
        {
          error: 'Missing required fields: transactionId, proofOfPayment',
        },
        { status: 400 }
      );
    }

    // Submit payment proof to backend
    const response = await apiClient.post(
      `/api/transactions/${transactionId}/upload-payment-proof`,
      {
        proof: proofOfPayment,
        paymentMethod: 'bank_transfer',
      }
    );

    return NextResponse.json({
      success: true,
      transactionId,
      status: 'awaiting_seller_confirmation',
      message:
        'Payment proof submitted. Awaiting seller confirmation of fund receipt.',
    });
  } catch (error) {
    console.error('Error verifying bank transfer:', error);
    const parsed = APIErrorHandler.parseError(error);
    return NextResponse.json(
      {
        error: APIErrorHandler.getUserMessage(error),
        statusCode: parsed.statusCode,
      },
      { status: 500 }
    );
  }
}
