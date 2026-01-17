<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KYCVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'user_type' => 'buyer',
            'kyc_verified' => false,
        ]);

        Storage::fake('public');
    }

    public function test_user_can_submit_kyc_documents()
    {
        $idDocument = UploadedFile::fake()->image('passport.jpg');
        $proofOfAddress = UploadedFile::fake()->image('utility-bill.jpg');

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/kyc/submit', [
                'id_type' => 'passport',
                'id_number' => 'AB1234567',
                'id_document' => $idDocument,
                'proof_of_address' => $proofOfAddress,
                'date_of_birth' => '1990-01-01',
                'country' => 'DE',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'KYC documents submitted successfully',
            ]);

        $this->user->refresh();
        $this->assertEquals('pending', $this->user->kyc_status);
        $this->assertNotNull($this->user->id_document_path);
        $this->assertNotNull($this->user->proof_of_address_path);
    }

    public function test_kyc_submission_requires_valid_id_type()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/kyc/submit', [
                'id_type' => 'invalid_type',
                'id_number' => 'AB1234567',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id_type']);
    }

    public function test_user_can_get_kyc_status()
    {
        $this->user->update([
            'kyc_status' => 'pending',
            'kyc_submitted_at' => now(),
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/kyc/status');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'pending',
                'submitted_at' => $this->user->kyc_submitted_at->toISOString(),
            ]);
    }

    public function test_admin_can_verify_kyc()
    {
        $admin = User::factory()->create(['user_type' => 'admin']);

        $this->user->update([
            'kyc_status' => 'pending',
            'id_document_path' => 'path/to/document.jpg',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/kyc/{$this->user->id}/verify", [
                'approved' => true,
            ]);

        $response->assertStatus(200);

        $this->user->refresh();
        $this->assertTrue($this->user->kyc_verified);
        $this->assertEquals('approved', $this->user->kyc_status);
        $this->assertNotNull($this->user->kyc_verified_at);
    }

    public function test_admin_can_reject_kyc_with_reason()
    {
        $admin = User::factory()->create(['user_type' => 'admin']);

        $this->user->update(['kyc_status' => 'pending']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/kyc/{$this->user->id}/verify", [
                'approved' => false,
                'rejection_reason' => 'Document not clear',
            ]);

        $response->assertStatus(200);

        $this->user->refresh();
        $this->assertFalse($this->user->kyc_verified);
        $this->assertEquals('rejected', $this->user->kyc_status);
        $this->assertEquals('Document not clear', $this->user->kyc_rejection_reason);
    }

    public function test_non_admin_cannot_verify_kyc()
    {
        $anotherUser = User::factory()->create(['user_type' => 'buyer']);

        $response = $this->actingAs($anotherUser, 'sanctum')
            ->postJson("/api/admin/kyc/{$this->user->id}/verify", [
                'approved' => true,
            ]);

        $response->assertStatus(403);
    }
}
