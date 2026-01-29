<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContractGenerated;
use App\Mail\PaymentInstructions as PaymentInstructionsEmail;
use App\Mail\PaymentConfirmed;
use App\Mail\ReadyForDelivery;
use App\Mail\OrderCompleted;
use Tests\TestCase;

/**
 * Test Suite for Complete Bank Transfer Payment Flow
 * Tests all steps from order creation to delivery
 */
class BankTransferPaymentFlowTest extends TestCase
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
        Mail::fake(); // Prevent actual emails from being sent

        // Create test users
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
            'name' => 'Admin User',
        ]);

        // Create test vehicle
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
            'price' => 25000,
            'brand' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
        ]);
    }

    /**
     * Test Step 1: Order Created
     * Buyer creates order for vehicle
     */
    public function test_buyer_can_create_order()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Str. Test 123, București',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'reference_number',
                    'status',
                    'vehicle_id',
                    'buyer_id',
                    'seller_id',
                    'amount',
                    'created_at',
                ]
            ]);

        $transaction = Transaction::find($response->json('data.id'));
        $this->assertEquals('order_created', $transaction->status);
        $this->assertEquals($this->buyer->id, $transaction->buyer_id);
        $this->assertEquals($this->seller->id, $transaction->seller_id);
        $this->assertEquals(25000, $transaction->amount);
        $this->assertNotNull($transaction->reference_number);

        // Store transaction for next tests
        $this->transaction = $transaction;
    }

    /**
     * Test Step 2: Contract Generated
     * Seller generates contract for order
     */
    public function test_seller_can_generate_contract()
    {
        // Create order first
        $this->test_buyer_can_create_order();

        Mail::reset();

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('contract_generated', $this->transaction->status);
        $this->assertNotNull($this->transaction->contract_signed_pdf_path);

        // Verify email was sent
        Mail::assertSent(ContractGenerated::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });
    }

    /**
     * Test Step 3: Contract Signed
     * Buyer uploads signed contract
     */
    public function test_buyer_can_upload_signed_contract()
    {
        // Generate contract first
        $this->test_seller_can_generate_contract();

        Mail::reset();

        // Create fake PDF content
        $pdfContent = base64_encode('PDF content here');

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,' . $pdfContent,
                'signature_type' => 'electronic',
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('contract_signed', $this->transaction->status);
        $this->assertNotNull($this->transaction->buyer_signed_contract_path);

        // Verify payment instructions email was sent
        Mail::assertSent(PaymentInstructionsEmail::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });
    }

    /**
     * Test Step 4: Payment Confirmed
     * Admin confirms buyer's bank transfer
     */
    public function test_admin_can_confirm_payment()
    {
        // Upload contract first
        $this->test_buyer_can_upload_signed_contract();

        Mail::reset();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456789',
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('payment_confirmed', $this->transaction->status);
        $this->assertNotNull($this->transaction->invoice_pdf_path);
        $this->assertNotNull($this->transaction->confirmed_at);

        // Verify confirmation email was sent
        Mail::assertSent(PaymentConfirmed::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });
    }

    /**
     * Test Step 5: Ready for Delivery
     * Seller marks vehicle ready for delivery
     */
    public function test_seller_can_mark_ready_for_delivery()
    {
        // Confirm payment first
        $this->test_admin_can_confirm_payment();

        Mail::reset();

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/mark-ready-delivery", [
                'delivery_notes' => 'Vehicle ready at showroom',
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('ready_for_delivery', $this->transaction->status);

        // Verify ready for delivery email was sent
        Mail::assertSent(ReadyForDelivery::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });
    }

    /**
     * Test Step 6: Delivered
     * Buyer confirms vehicle delivery
     */
    public function test_buyer_can_confirm_delivery()
    {
        // Mark ready for delivery first
        $this->test_seller_can_mark_ready_for_delivery();

        Mail::reset();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/mark-delivered", [
                'delivery_confirmation' => 'Vehicle received in good condition',
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('delivered', $this->transaction->status);
    }

    /**
     * Test Step 7: Completed
     * System marks order as completed
     */
    public function test_order_completion_automatically()
    {
        // Deliver first
        $this->test_buyer_can_confirm_delivery();

        Mail::reset();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/complete-order");

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('completed', $this->transaction->status);
        $this->assertNotNull($this->transaction->completed_at);

        // Verify completion email was sent
        Mail::assertSent(OrderCompleted::class, function ($mail) {
            return $mail->hasTo($this->buyer->email);
        });
    }

    /**
     * Test: Authorization - Only buyer can upload contract
     */
    public function test_only_buyer_can_upload_contract()
    {
        $this->test_seller_can_generate_contract();

        // Try to upload as seller
        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:application/pdf;base64,TEST',
                'signature_type' => 'electronic',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Authorization - Only admin can confirm payment
     */
    public function test_only_admin_can_confirm_payment()
    {
        $this->test_buyer_can_upload_signed_contract();

        // Try to confirm as buyer
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Authorization - Only seller can mark ready for delivery
     */
    public function test_only_seller_can_mark_ready_for_delivery()
    {
        $this->test_admin_can_confirm_payment();

        // Try to mark as buyer
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/mark-ready-delivery", [
                'delivery_notes' => 'Ready',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test: Validation - Contract upload requires PDF
     */
    public function test_contract_upload_requires_pdf()
    {
        $this->test_seller_can_generate_contract();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/upload-signed-contract", [
                'contract_pdf' => 'data:image/png;base64,TEST', // Wrong format
                'signature_type' => 'electronic',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test: Flow Error - Cannot confirm payment before contract signed
     */
    public function test_cannot_confirm_payment_before_contract_signed()
    {
        $this->test_seller_can_generate_contract();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test: Get Payment Instructions
     */
    public function test_buyer_can_get_payment_instructions()
    {
        $this->test_buyer_can_upload_signed_contract();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/orders/{$this->transaction->id}/payment-instructions");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'iban',
                    'account_holder',
                    'bank_name',
                    'amount',
                    'reference',
                    'deadline',
                    'days_remaining',
                ]
            ]);

        $data = $response->json('data');
        $this->assertEquals(25000, $data['amount']);
        $this->assertNotNull($data['iban']);
        $this->assertNotNull($data['reference']);
    }

    /**
     * Test: Order Cancellation - Seller can cancel before contract signed
     */
    public function test_seller_can_cancel_before_contract_signed()
    {
        $this->test_buyer_can_create_order();

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/cancel-order", [
                'reason' => 'Vehicle sold to someone else',
            ]);

        $response->assertStatus(200);

        $this->transaction->refresh();
        $this->assertEquals('cancelled', $this->transaction->status);
        $this->assertNotNull($this->transaction->cancelled_at);
    }

    /**
     * Test: Order Cancellation - Cannot cancel after payment confirmed
     */
    public function test_cannot_cancel_after_payment_confirmed()
    {
        $this->test_admin_can_confirm_payment();

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$this->transaction->id}/cancel-order", [
                'reason' => 'Testing',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test: Multiple Users Cannot Interfere
     */
    public function test_other_users_cannot_access_order()
    {
        $this->test_buyer_can_create_order();

        $otherBuyer = User::factory()->create([
            'user_type' => 'buyer',
            'kyc_verified' => true,
        ]);

        // Other buyer cannot view this transaction
        $response = $this->actingAs($otherBuyer, 'sanctum')
            ->getJson("/api/orders/{$this->transaction->id}");

        $response->assertStatus(403);
    }

    /**
     * Test: Timeline Tracking
     */
    public function test_timeline_is_tracked_correctly()
    {
        $this->test_order_completion_automatically();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/orders/{$this->transaction->id}");

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertNotNull($data['created_at']);
        $this->assertNotNull($data['confirmed_at']);
        $this->assertNotNull($data['completed_at']);
    }
}
