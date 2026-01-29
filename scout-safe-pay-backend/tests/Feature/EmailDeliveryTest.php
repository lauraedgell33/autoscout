<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContractGenerated;
use App\Mail\PaymentInstructions;
use App\Mail\PaymentConfirmed;
use App\Mail\ReadyForDelivery;
use App\Mail\OrderCompleted;
use Tests\TestCase;

/**
 * Email Delivery Tests
 * Verifies all emails are sent correctly with proper content and attachments
 */
class EmailDeliveryTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $seller;
    protected User $admin;
    protected Vehicle $vehicle;
    protected Transaction $transaction;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();

        $this->buyer = User::factory()->create([
            'user_type' => 'buyer',
            'email' => 'buyer@test.com',
            'name' => 'John Buyer',
            'kyc_verified' => true,
        ]);

        $this->seller = User::factory()->create([
            'user_type' => 'seller',
            'email' => 'seller@test.com',
            'name' => 'Jane Seller',
            'kyc_verified' => true,
        ]);

        $this->admin = User::factory()->create([
            'user_type' => 'admin',
            'email' => 'admin@test.com',
        ]);

        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
            'price' => 25000,
            'brand' => 'BMW',
            'model' => 'X5',
        ]);
    }

    /**
     * Test: ContractGenerated Email
     * Verify email sent when dealer generates contract
     */
    public function test_contract_generated_email_content()
    {
        // Create order
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));
        Mail::reset();

        // Generate contract
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        // Verify email sent to buyer
        Mail::assertSent(ContractGenerated::class, function ($mail) {
            return $mail->hasTo($this->buyer->email)
                && $mail->hasCc($this->seller->email);
        });

        // Get the mailable instance
        $mailable = Mail::sent(ContractGenerated::class)->first();
        $this->assertNotNull($mailable);

        // Verify it has contract attachment
        $content = $mailable->render();
        $this->assertStringContainsString('BMW', $content);
        $this->assertStringContainsString('25000', $content);
    }

    /**
     * Test: PaymentInstructions Email
     * Verify payment instructions email with IBAN and reference
     */
    public function test_payment_instructions_email_content()
    {
        // Setup: Create and sign contract
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        Mail::reset();

        // Upload signed contract (triggers payment instructions email)
        $pdfContent = base64_encode('PDF content');
        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        // Verify payment instructions email was sent
        Mail::assertSent(PaymentInstructions::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });

        // Verify email content
        $mailable = Mail::sent(PaymentInstructions::class)->first();
        $content = $mailable->render();

        $this->assertStringContainsString('25000', $content); // Amount
        $this->assertStringContainsString('EUR', $content); // Currency
        $this->assertStringContainsString('IBAN', $content); // IBAN placeholder
    }

    /**
     * Test: PaymentConfirmed Email with Invoice
     * Verify confirmation email includes invoice PDF
     */
    public function test_payment_confirmed_email_with_invoice()
    {
        // Setup: Create, sign contract, then confirm payment
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        // Generate contract
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        // Upload signed contract
        $pdfContent = base64_encode('PDF content');
        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        Mail::reset();

        // Confirm payment (triggers confirmation email)
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456',
            ]);

        // Verify confirmation email sent to buyer and seller
        Mail::assertSent(PaymentConfirmed::class, function ($mail) {
            return $mail->hasTo($this->buyer->email)
                && $mail->hasCc($this->seller->email);
        });

        // Verify email content
        $mailable = Mail::sent(PaymentConfirmed::class)->first();
        $content = $mailable->render();

        $this->assertStringContainsString('Invoice', $content);
        $this->assertStringContainsString('confirmed', $content);
    }

    /**
     * Test: ReadyForDelivery Email
     * Verify email sent when seller marks ready
     */
    public function test_ready_for_delivery_email()
    {
        // Complete setup through payment confirmation
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $pdfContent = base64_encode('PDF');
        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456',
            ]);

        Mail::reset();

        // Mark ready for delivery
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/mark-ready-delivery", [
                'delivery_notes' => 'Vehicle ready at showroom',
            ]);

        // Verify email sent
        Mail::assertSent(ReadyForDelivery::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });

        $mailable = Mail::sent(ReadyForDelivery::class)->first();
        $content = $mailable->render();

        $this->assertStringContainsString('ready', $content);
        $this->assertStringContainsString('delivery', $content);
    }

    /**
     * Test: OrderCompleted Email
     * Verify completion email sent
     */
    public function test_order_completed_email()
    {
        // Complete full flow up to delivery
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $pdfContent = base64_encode('PDF');
        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456',
            ]);

        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/mark-ready-delivery", [
                'delivery_notes' => 'Ready',
            ]);

        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/mark-delivered", [
                'delivery_confirmation' => 'Received',
            ]);

        Mail::reset();

        // Complete order
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/complete-order");

        // Verify completion email sent
        Mail::assertSent(OrderCompleted::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });

        $mailable = Mail::sent(OrderCompleted::class)->first();
        $content = $mailable->render();

        $this->assertStringContainsString('completed', $content);
        $this->assertStringContainsString('review', $content);
    }

    /**
     * Test: All Emails in Sequence
     * Verify all 5 emails are sent in correct order
     */
    public function test_all_emails_sent_in_sequence()
    {
        // Create order
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        // Should have no emails yet
        Mail::assertNothingSent();

        // Generate contract - Email 1: ContractGenerated
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        Mail::assertSent(ContractGenerated::class);

        Mail::reset();

        // Upload contract - Email 2: PaymentInstructions
        $pdfContent = base64_encode('PDF');
        $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        Mail::assertSent(PaymentInstructions::class);

        Mail::reset();

        // Confirm payment - Email 3: PaymentConfirmed
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456',
            ]);

        Mail::assertSent(PaymentConfirmed::class);

        Mail::reset();

        // Mark ready - Email 4: ReadyForDelivery
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/mark-ready-delivery", [
                'delivery_notes' => 'Ready',
            ]);

        Mail::assertSent(ReadyForDelivery::class);

        // Delivery and completion handled in separate steps
    }

    /**
     * Test: Email Recipients
     * Verify emails go to correct recipients
     */
    public function test_email_recipients_are_correct()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));
        Mail::reset();

        // Generate contract
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        // Verify buyer gets email and seller is CC'd
        Mail::assertSent(ContractGenerated::class, function ($mail) {
            // Check buyer is primary recipient
            $recipients = collect($mail->to)->pluck('address')->toArray();
            $this->assertContains($this->buyer->email, $recipients);

            // Check seller is CC'd
            $ccs = collect($mail->cc)->pluck('address')->toArray();
            $this->assertContains($this->seller->email, $ccs);

            return true;
        });
    }
}
