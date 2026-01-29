import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PaymentInstructions from '@/components/orders/PaymentInstructions';
import UploadSignedContract from '@/components/orders/UploadSignedContract';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import PaymentConfirmationPanel from '@/components/admin/PaymentConfirmationPanel';

/**
 * PaymentInstructions Component Tests
 */
describe('PaymentInstructions Component', () => {
  const mockTransaction = {
    id: 1,
    reference_number: 'AS24-ABC123',
    amount: 25000,
    status: 'awaiting_bank_transfer',
    payment_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    iban: 'DE44 0667 6244 7444 8175 98',
    account_holder: 'AutoScout24 SafeTrade',
    bank_name: 'Deutsche Bank',
  };

  test('renders payment instructions correctly', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    expect(screen.getByText(/Payment Instructions/i)).toBeInTheDocument();
    expect(screen.getByText(/IBAN/i)).toBeInTheDocument();
    expect(screen.getByText('DE44 0667 6244 7444 8175 98')).toBeInTheDocument();
  });

  test('displays correct payment amount', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    expect(screen.getByText(/25,000/i)).toBeInTheDocument();
    expect(screen.getByText(/EUR/i)).toBeInTheDocument();
  });

  test('shows account holder name', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    expect(screen.getByText('AutoScout24 SafeTrade')).toBeInTheDocument();
  });

  test('copy to clipboard works for IBAN', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    const clipboardMock = {
      writeText: jest.fn(),
    };
    Object.assign(navigator, { clipboard: clipboardMock });

    render(<PaymentInstructions transaction={mockTransaction} />);
    
    const copyIbanButton = screen.getByRole('button', { name: /copy iban/i });
    await user.click(copyIbanButton);

    expect(clipboardMock.writeText).toHaveBeenCalledWith('DE44 0667 6244 7444 8175 98');
  });

  test('displays payment reference', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    expect(screen.getByText(/AS24-ABC123/i)).toBeInTheDocument();
  });

  test('shows deadline countdown', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    // Should show deadline warning
    const deadlineSection = screen.getByText(/deadline/i);
    expect(deadlineSection).toBeInTheDocument();
  });

  test('displays warning when deadline is approaching', () => {
    const soonTransaction = {
      ...mockTransaction,
      payment_deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    };

    render(<PaymentInstructions transaction={soonTransaction} />);
    
    // Should show yellow/warning alert
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  test('displays danger alert when deadline passed', () => {
    const overdueTransaction = {
      ...mockTransaction,
      payment_deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    };

    render(<PaymentInstructions transaction={overdueTransaction} />);
    
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  test('shows payment steps', () => {
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 3/i)).toBeInTheDocument();
  });

  test('responsive design on mobile', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    
    render(<PaymentInstructions transaction={mockTransaction} />);
    
    const container = screen.getByText(/Payment Instructions/i).closest('div');
    expect(container).toBeInTheDocument();
  });
});

/**
 * UploadSignedContract Component Tests
 */
describe('UploadSignedContract Component', () => {
  const mockTransaction = {
    id: 1,
    reference_number: 'AS24-ABC123',
    status: 'contract_generated',
  };

  test('renders upload component correctly', () => {
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    expect(screen.getByText(/Upload Signed Contract/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument();
  });

  test('displays download contract button', () => {
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    expect(screen.getByRole('button', { name: /Download Contract/i })).toBeInTheDocument();
  });

  test('accepts PDF files via file input', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={onSuccess}
      />
    );
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const pdfFile = new File(['PDF content'], 'contract.pdf', { type: 'application/pdf' });
    
    await user.upload(fileInput, pdfFile);
    
    expect(fileInput.files[0]).toBe(pdfFile);
  });

  test('shows file preview when file selected', async () => {
    const user = userEvent.setup();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const pdfFile = new File(['PDF content'], 'contract.pdf', { type: 'application/pdf' });
    
    await user.upload(fileInput, pdfFile);
    
    expect(screen.getByText('contract.pdf')).toBeInTheDocument();
  });

  test('rejects non-PDF files', async () => {
    const user = userEvent.setup();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const invalidFile = new File(['content'], 'file.txt', { type: 'text/plain' });
    
    await user.upload(fileInput, invalidFile);
    
    // Should show error
    expect(screen.getByText(/PDF files only/i)).toBeInTheDocument();
  });

  test('shows signature type selection', () => {
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    expect(screen.getByLabelText(/Physical/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Electronic/i)).toBeInTheDocument();
  });

  test('displays file size after selection', async () => {
    const user = userEvent.setup();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const pdfFile = new File(['PDF content'], 'contract.pdf', { type: 'application/pdf' });
    
    await user.upload(fileInput, pdfFile);
    
    expect(screen.getByText(/11 bytes/i)).toBeInTheDocument();
  });

  test('upload button enabled after file selected', async () => {
    const user = userEvent.setup();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const uploadButton = screen.getByRole('button', { name: /Upload/i });
    expect(uploadButton).toBeDisabled();
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const pdfFile = new File(['PDF content'], 'contract.pdf', { type: 'application/pdf' });
    
    await user.upload(fileInput, pdfFile);
    
    expect(uploadButton).toBeEnabled();
  });

  test('shows remove file button', async () => {
    const user = userEvent.setup();
    
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const fileInput = screen.getByLabelText(/contract file/i, { hidden: true });
    const pdfFile = new File(['PDF content'], 'contract.pdf', { type: 'application/pdf' });
    
    await user.upload(fileInput, pdfFile);
    
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
    
    await user.click(removeButton);
    
    expect(fileInput.files.length).toBe(0);
  });

  test('drag and drop functionality', async () => {
    render(
      <UploadSignedContract 
        transaction={mockTransaction}
        onSuccess={jest.fn()}
      />
    );
    
    const dropZone = screen.getByText(/Drag and drop/i).closest('div');
    const pdfFile = new File(['PDF'], 'contract.pdf', { type: 'application/pdf' });
    
    // Simulate drag and drop
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [pdfFile],
      },
    });
    
    expect(screen.getByText('contract.pdf')).toBeInTheDocument();
  });
});

/**
 * OrderStatusTracker Component Tests
 */
describe('OrderStatusTracker Component', () => {
  const mockTransaction = {
    id: 1,
    status: 'payment_confirmed',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contract_signed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    confirmed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  };

  test('renders all 6 steps', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    expect(screen.getByText(/Order Created/i)).toBeInTheDocument();
    expect(screen.getByText(/Contract Generated/i)).toBeInTheDocument();
    expect(screen.getByText(/Contract Signed/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready for Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
  });

  test('highlights current step', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    const currentStep = screen.getByText(/Payment Confirmed/i);
    expect(currentStep.closest('div')).toHaveClass('bg-orange-100');
  });

  test('shows completed steps with checkmark', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    // All steps before current should show checkmark
    const checkmarks = screen.getAllByTestId('step-complete');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  test('shows upcoming steps as disabled', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    // Steps after current should be grayed out
    const upcomingSteps = screen.getAllByTestId('step-upcoming');
    expect(upcomingSteps.length).toBeGreaterThan(0);
  });

  test('displays progress bar', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  test('shows timestamps for completed steps', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    // Should show dates for completed steps
    const dateElements = screen.getAllByTestId(/step-date/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test('responsive layout on mobile', () => {
    global.innerWidth = 375;
    
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    const tracker = screen.getByTestId('status-tracker');
    // Should have vertical class on mobile
    expect(tracker).toHaveClass('flex-col');
  });

  test('horizontal layout on desktop', () => {
    global.innerWidth = 1024;
    
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    const tracker = screen.getByTestId('status-tracker');
    // Should have horizontal class on desktop
    expect(tracker).toHaveClass('flex-row');
  });

  test('displays current step status', () => {
    render(<OrderStatusTracker transaction={mockTransaction} />);
    
    expect(screen.getByText(/Current Step:/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Confirmed/i)).toBeInTheDocument();
  });
});

/**
 * PaymentConfirmationPanel Component Tests
 */
describe('PaymentConfirmationPanel Component', () => {
  const mockPendingPayments = [
    {
      id: 1,
      reference_number: 'AS24-001',
      buyer_name: 'John Doe',
      buyer_email: 'john@test.com',
      amount: 25000,
      payment_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'awaiting_confirmation',
      transaction_code: 'TRANS123',
    },
    {
      id: 2,
      reference_number: 'AS24-002',
      buyer_name: 'Jane Smith',
      buyer_email: 'jane@test.com',
      amount: 30000,
      payment_deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'awaiting_confirmation',
      transaction_code: 'TRANS456',
    },
  ];

  test('renders admin panel correctly', () => {
    render(<PaymentConfirmationPanel />);
    
    expect(screen.getByText(/Payment Confirmation/i)).toBeInTheDocument();
  });

  test('displays statistics cards', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { awaiting: 5, overdue: 2, total: 210000 } }),
      })
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Awaiting Confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/Overdue/i)).toBeInTheDocument();
    });
  });

  test('displays transactions table', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      })
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      expect(screen.getByText('AS24-001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('search functionality works', async () => {
    const user = userEvent.setup();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      })
    );

    render(<PaymentConfirmationPanel />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    
    await user.type(searchInput, 'AS24-001');

    expect(searchInput).toHaveValue('AS24-001');
  });

  test('filter buttons work', async () => {
    const user = userEvent.setup();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      })
    );

    render(<PaymentConfirmationPanel />);

    const overdueButton = screen.getByRole('button', { name: /Overdue/i });
    
    await user.click(overdueButton);
    
    // Should fetch filtered data
    expect(global.fetch).toHaveBeenCalled();
  });

  test('confirm payment button works', async () => {
    const user = userEvent.setup();
    const confirmSpy = jest.fn();
    
    global.fetch = jest.fn((url) => {
      if (url.includes('/confirm-payment')) {
        confirmSpy();
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      });
    });

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      const confirmButtons = screen.getAllByRole('button', { name: /Confirm/i });
      expect(confirmButtons.length).toBeGreaterThan(0);
    });
  });

  test('shows modal with transaction details', async () => {
    const user = userEvent.setup();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      })
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      const viewButton = screen.getByRole('button', { name: /View/i });
      fireEvent.click(viewButton);
    });

    expect(screen.getByText(/Transaction Details/i)).toBeInTheDocument();
  });

  test('displays color-coded deadline badges', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPendingPayments }),
      })
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      // First transaction has 5 days (green)
      // Second transaction is overdue (red)
      const badges = screen.getAllByTestId(/deadline-badge/);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  test('empty state message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: [] }),
      })
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      expect(screen.getByText(/No pending payments/i)).toBeInTheDocument();
    });
  });

  test('loading state', () => {
    global.fetch = jest.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve({ data: [] }),
      }), 1000))
    );

    render(<PaymentConfirmationPanel />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('error handling', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<PaymentConfirmationPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading/i)).toBeInTheDocument();
    });
  });
});
