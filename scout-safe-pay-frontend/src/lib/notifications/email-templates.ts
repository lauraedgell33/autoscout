// Email notification templates for transactional emails
// These will be used by the backend via API
import { getApiUrl } from '@/lib/utils';

export const emailTemplates = {
  /**
   * Transaction started notification
   */
  transactionStarted: {
    subject: 'Your transaction has been started - AutoScout24 SafeTrade',
    templateId: 'transaction_started',
    variables: ['buyerName', 'sellerName', 'vehicleName', 'price', 'transactionUrl'],
    preview: 'Transaction started for {{vehicleName}}',
  },

  /**
   * Payment verification notification
   */
  paymentVerified: {
    subject: 'Payment verified - AutoScout24 SafeTrade',
    templateId: 'payment_verified',
    variables: ['buyerName', 'amount', 'transactionId', 'estimatedReleaseDate'],
    preview: 'Your payment of €{{amount}} has been verified',
  },

  /**
   * Funds released notification
   */
  fundsReleased: {
    subject: 'Funds released to your account - AutoScout24 SafeTrade',
    templateId: 'funds_released',
    variables: ['sellerName', 'amount', 'transactionId', 'bankAccountName'],
    preview: 'Funds released: €{{amount}}',
  },

  /**
   * Transaction completed notification
   */
  transactionCompleted: {
    subject: 'Transaction completed successfully - AutoScout24 SafeTrade',
    templateId: 'transaction_completed',
    variables: ['buyerName', 'vehicleName', 'price', 'transactionId'],
    preview: 'Your transaction is complete',
  },

  /**
   * Dispute created notification
   */
  disputeCreated: {
    subject: 'Dispute reported - AutoScout24 SafeTrade',
    templateId: 'dispute_created',
    variables: ['userName', 'disputeReason', 'transactionId', 'disputeUrl'],
    preview: 'Dispute case #{{transactionId}} created',
  },

  /**
   * Message received notification
   */
  messageReceived: {
    subject: 'New message from {{senderName}} - AutoScout24 SafeTrade',
    templateId: 'message_received',
    variables: ['recipientName', 'senderName', 'messagePreview', 'conversationUrl'],
    preview: 'New message: {{messagePreview}}',
  },

  /**
   * KYC submitted notification
   */
  kycSubmitted: {
    subject: 'KYC verification submitted - AutoScout24 SafeTrade',
    templateId: 'kyc_submitted',
    variables: ['userName', 'estimatedVerificationTime'],
    preview: 'Your KYC documents have been received',
  },

  /**
   * KYC approved notification
   */
  kycApproved: {
    subject: 'KYC verification approved - AutoScout24 SafeTrade',
    templateId: 'kyc_approved',
    variables: ['userName'],
    preview: 'You have been verified and can now access all features',
  },

  /**
   * KYC rejected notification
   */
  kycRejected: {
    subject: 'KYC verification requires attention - AutoScout24 SafeTrade',
    templateId: 'kyc_rejected',
    variables: ['userName', 'rejectionReason', 'resubmitUrl'],
    preview: 'Your KYC submission needs revision',
  },

  /**
   * Welcome email for new users
   */
  welcomeEmail: {
    subject: 'Welcome to AutoScout24 SafeTrade',
    templateId: 'welcome_email',
    variables: ['userName', 'userRole', 'getStartedUrl'],
    preview: 'Welcome {{userName}}! Get started with AutoScout24 SafeTrade',
  },

  /**
   * Password reset email
   */
  passwordReset: {
    subject: 'Reset your password - AutoScout24 SafeTrade',
    templateId: 'password_reset',
    variables: ['userName', 'resetLink', 'expirationTime'],
    preview: 'Password reset link valid for {{expirationTime}}',
  },

  /**
   * Email verification
   */
  emailVerification: {
    subject: 'Verify your email - AutoScout24 SafeTrade',
    templateId: 'email_verification',
    variables: ['userName', 'verificationLink', 'expirationTime'],
    preview: 'Verify your email address',
  },
};

/**
 * Send email notification via API
 */
export async function sendEmailNotification(
  templateId: string,
  recipientEmail: string,
  variables: Record<string, any>,
  options?: {
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
  }
) {
  try {
    const response = await fetch(
      `${getApiUrl()}/notifications/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          templateId,
          recipientEmail,
          variables,
          options,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

/**
 * Send batch emails
 */
export async function sendBatchEmails(
  templateId: string,
  recipients: Array<{ email: string; variables: Record<string, any> }>,
  options?: {
    cc?: string[];
    bcc?: string[];
  }
) {
  try {
    const response = await fetch(
      `${getApiUrl()}/notifications/send-batch-emails`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          templateId,
          recipients,
          options,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send batch emails: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Batch email send failed:', error);
    throw error;
  }
}

export default emailTemplates;
