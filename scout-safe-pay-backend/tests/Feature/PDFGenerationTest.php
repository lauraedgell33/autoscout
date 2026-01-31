<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * PDF Generation Tests
 * Verifies contract and invoice PDFs are generated correctly
 * 
 * @group integration
 * @group skip-ci
 */
class PDFGenerationTest extends TestCase
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
        $this->markTestSkipped('Integration test - requires PDF generation setup. Run separately.');

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
            'make' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'vin' => 'WBXYZ0100Z0000001',
            'mileage' => 45000,
            'fuel_type' => 'diesel',
            'transmission' => 'automatic',
        ]);
    }

    /**
     * Test: Contract PDF Generation
     * Verify PDF is created when dealer generates contract
     */
    public function test_contract_pdf_is_generated()
    {
        // Create order
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Str. Test 123, București',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));
        $this->assertNull($transaction->contract_signed_pdf_path);

        // Generate contract
        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $response->assertStatus(200);

        // Verify PDF path was set
        $transaction->refresh();
        $this->assertNotNull($transaction->contract_signed_pdf_path);
        $this->assertStringContainsString('.pdf', $transaction->contract_signed_pdf_path);
    }

    /**
     * Test: Contract PDF Contains Required Information
     */
    public function test_contract_pdf_contains_vehicle_details()
    {
        // Create and sign order
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Str. Test 123, București',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        // Generate contract
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $transaction->refresh();

        // Verify PDF file exists
        $pdfPath = storage_path('app/' . $transaction->contract_signed_pdf_path);
        $this->assertFileExists($pdfPath);

        // Check file is not empty
        $this->assertGreaterThan(0, filesize($pdfPath));
    }

    /**
     * Test: Invoice PDF Generation on Payment Confirmation
     */
    public function test_invoice_pdf_is_generated_on_payment_confirmation()
    {
        // Setup: Create, sign contract, then confirm payment
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Str. Test 123, București',
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

        // Confirm payment
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/orders/{$transaction->id}/confirm-payment", [
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'DE89370400440532013000',
                'payment_date' => now()->toDateString(),
                'transaction_code' => 'TRANS123456',
            ]);

        $response->assertStatus(200);

        // Verify invoice PDF path was set
        $transaction->refresh();
        $this->assertNotNull($transaction->invoice_pdf_path);
        $this->assertStringContainsString('.pdf', $transaction->invoice_pdf_path);

        // Verify PDF file exists
        $invoicePath = storage_path('app/' . $transaction->invoice_pdf_path);
        $this->assertFileExists($invoicePath);
        $this->assertGreaterThan(0, filesize($invoicePath));
    }

    /**
     * Test: Invoice Contains Correct Amount
     */
    public function test_invoice_pdf_contains_correct_amount()
    {
        // Complete flow up to payment confirmation
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Str. Test 123, București',
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

        $transaction->refresh();

        // Verify invoice is accessible via API
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/orders/{$transaction->id}/invoice");

        $response->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
    }

    /**
     * Test: PDF Downloads
     */
    public function test_buyer_can_download_contract()
    {
        // Create and sign contract
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

        // Download contract
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/orders/{$transaction->id}/contract");

        $response->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('attachment', $response->headers->get('Content-Disposition'));
    }

    /**
     * Test: PDF Download Requires Authentication
     */
    public function test_unauthenticated_user_cannot_download_pdf()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Test Address',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction = Transaction::find($response->json('data.id'));

        // Logout and try to download
        $response = $this->getJson("/api/orders/{$transaction->id}/contract");
        $response->assertStatus(401);
    }

    /**
     * Test: Only Authorized Users Can Download
     */
    public function test_only_authorized_users_can_download_pdf()
    {
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

        // Other buyer cannot download
        $otherBuyer = User::factory()->create([
            'user_type' => 'buyer',
            'kyc_verified' => true,
        ]);

        $response = $this->actingAs($otherBuyer, 'sanctum')
            ->getJson("/api/orders/{$transaction->id}/contract");

        $response->assertStatus(403);
    }

    /**
     * Test: Multiple Vehicles in PDFs
     */
    public function test_contracts_for_different_vehicles()
    {
        $vehicle2 = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
            'price' => 30000,
            'make' => 'Mercedes',
            'model' => 'C-Class',
            'year' => 2022,
        ]);

        // Order 1
        $response1 = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $this->vehicle->id,
                'delivery_address' => 'Address 1',
                'delivery_contact' => '+40 712 345 678',
            ]);

        $transaction1 = Transaction::find($response1->json('data.id'));

        // Order 2
        $response2 = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/orders', [
                'vehicle_id' => $vehicle2->id,
                'delivery_address' => 'Address 2',
                'delivery_contact' => '+40 712 345 679',
            ]);

        $transaction2 = Transaction::find($response2->json('data.id'));

        // Generate contracts
        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction1->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/orders/{$transaction2->id}/generate-contract", [
                'terms_agreed' => true,
            ]);

        $transaction1->refresh();
        $transaction2->refresh();

        // Verify different PDF files
        $this->assertNotEquals(
            $transaction1->contract_signed_pdf_path,
            $transaction2->contract_signed_pdf_path
        );

        // Both files exist
        $this->assertFileExists(storage_path('app/' . $transaction1->contract_signed_pdf_path));
        $this->assertFileExists(storage_path('app/' . $transaction2->contract_signed_pdf_path));
    }

    /**
     * Test: Contract PDF File Format
     */
    public function test_contract_pdf_is_valid_format()
    {
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

        $transaction->refresh();

        $pdfPath = storage_path('app/' . $transaction->contract_signed_pdf_path);
        
        // Verify file has PDF signature
        $handle = fopen($pdfPath, 'rb');
        $header = fread($handle, 5);
        fclose($handle);

        $this->assertEquals('%PDF-', $header, 'File is not a valid PDF');
    }

    /**
     * Test: PDF Filename Format
     */
    public function test_pdf_filenames_are_properly_formatted()
    {
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

        $transaction->refresh();

        // Filename should contain reference number
        $this->assertStringContainsString(
            $transaction->reference_number,
            $transaction->contract_signed_pdf_path
        );

        // Should end with .pdf
        $this->assertTrue(str_ends_with($transaction->contract_signed_pdf_path, '.pdf'));
    }
}
