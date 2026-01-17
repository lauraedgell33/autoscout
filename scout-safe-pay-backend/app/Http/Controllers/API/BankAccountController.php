<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBankAccountRequest;
use App\Http\Requests\UpdateBankAccountRequest;
use App\Models\BankAccount;
use App\Services\IbanValidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BankAccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display user's bank accounts
     */
    public function index(): JsonResponse
    {
        $accounts = BankAccount::where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', auth()->id())
            ->orderBy('is_primary', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->id,
                    'account_holder_name' => $account->account_holder_name,
                    'iban_masked' => IbanValidationService::mask(decrypt($account->getAttributes()['iban'])),
                    'iban_last_four' => substr(decrypt($account->getAttributes()['iban']), -4),
                    'bank_name' => $account->bank_name,
                    'bank_country' => $account->bank_country,
                    'currency' => $account->currency ?? 'EUR',
                    'is_verified' => $account->is_verified,
                    'is_primary' => $account->is_primary,
                    'verified_at' => $account->verified_at?->format('Y-m-d H:i:s'),
                    'created_at' => $account->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $accounts,
            'message' => 'Bank accounts retrieved successfully',
        ]);
    }

    /**
     * Store new bank account
     */
    public function store(StoreBankAccountRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (!IbanValidationService::validate($validated['iban'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid IBAN. Please check and try again.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            if ($request->boolean('is_primary')) {
                BankAccount::where('accountable_type', 'App\\Models\\User')
                    ->where('accountable_id', auth()->id())
                    ->update(['is_primary' => false]);
            }

            $account = BankAccount::create([
                'accountable_type' => 'App\\Models\\User',
                'accountable_id' => auth()->id(),
                'account_holder_name' => $validated['account_holder_name'],
                'iban' => $validated['iban'],
                'swift_bic' => $validated['swift_bic'] ?? null,
                'bank_name' => $validated['bank_name'],
                'bank_country' => $validated['bank_country'],
                'currency' => $validated['currency'] ?? 'EUR',
                'is_primary' => $validated['is_primary'] ?? false,
                'is_verified' => false,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $account->id,
                    'account_holder_name' => $account->account_holder_name,
                    'iban_masked' => IbanValidationService::mask($validated['iban']),
                    'bank_name' => $account->bank_name,
                    'bank_country' => $account->bank_country,
                    'is_verified' => false,
                    'is_primary' => $account->is_primary,
                ],
                'message' => 'Bank account added successfully. Pending admin verification.',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add bank account: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display specified bank account
     */
    public function show(string $id): JsonResponse
    {
        $account = BankAccount::where('id', $id)
            ->where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', auth()->id())
            ->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $account->id,
                'account_holder_name' => $account->account_holder_name,
                'iban_masked' => IbanValidationService::mask(decrypt($account->getAttributes()['iban'])),
                'iban_formatted' => $account->is_verified ? IbanValidationService::format(decrypt($account->getAttributes()['iban'])) : null,
                'swift_bic' => $account->swift_bic,
                'bank_name' => $account->bank_name,
                'bank_country' => $account->bank_country,
                'currency' => $account->currency,
                'is_verified' => $account->is_verified,
                'is_primary' => $account->is_primary,
                'verified_at' => $account->verified_at?->format('Y-m-d H:i:s'),
                'verification_notes' => $account->verification_notes,
                'created_at' => $account->created_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Update bank account
     */
    public function update(UpdateBankAccountRequest $request, string $id): JsonResponse
    {
        $account = BankAccount::where('id', $id)
            ->where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', auth()->id())
            ->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account not found',
            ], 404);
        }

        if ($account->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot edit verified bank account. Please add a new account instead.',
            ], 403);
        }

        $validated = $request->validated();

        if (isset($validated['iban']) && !IbanValidationService::validate($validated['iban'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid IBAN. Please check and try again.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            if (isset($validated['is_primary']) && $validated['is_primary']) {
                BankAccount::where('accountable_type', 'App\\Models\\User')
                    ->where('accountable_id', auth()->id())
                    ->where('id', '!=', $id)
                    ->update(['is_primary' => false]);
            }

            $account->update($validated);
            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $account->id,
                    'account_holder_name' => $account->account_holder_name,
                    'iban_masked' => IbanValidationService::mask($validated['iban'] ?? decrypt($account->getAttributes()['iban'])),
                    'bank_name' => $account->bank_name,
                    'is_primary' => $account->is_primary,
                ],
                'message' => 'Bank account updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bank account: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove bank account
     */
    public function destroy(string $id): JsonResponse
    {
        $account = BankAccount::where('id', $id)
            ->where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', auth()->id())
            ->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account not found',
            ], 404);
        }

        $isPrimary = $account->is_primary;
        $account->delete();

        if ($isPrimary) {
            $newPrimary = BankAccount::where('accountable_type', 'App\\Models\\User')
                ->where('accountable_id', auth()->id())
                ->where('is_verified', true)
                ->first();

            if ($newPrimary) {
                $newPrimary->update(['is_primary' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Bank account deleted successfully',
        ]);
    }

    /**
     * Set bank account as primary
     */
    public function setPrimary(string $id): JsonResponse
    {
        $account = BankAccount::where('id', $id)
            ->where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', auth()->id())
            ->first();

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account not found',
            ], 404);
        }

        if (!$account->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Only verified accounts can be set as primary',
            ], 403);
        }

        DB::beginTransaction();
        try {
            BankAccount::where('accountable_type', 'App\\Models\\User')
                ->where('accountable_id', auth()->id())
                ->update(['is_primary' => false]);

            $account->update(['is_primary' => true]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bank account set as primary successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to set primary account: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Verify bank account
     */
    public function verify(Request $request, string $id): JsonResponse
    {
        if (!auth()->user()->hasRole(['super_admin', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $request->validate([
            'verified' => 'required|boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        $account = BankAccount::findOrFail($id);

        $account->update([
            'is_verified' => $request->boolean('verified'),
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'verification_notes' => $request->input('notes'),
        ]);

        return response()->json([
            'success' => true,
            'message' => $request->boolean('verified') 
                ? 'Bank account verified successfully' 
                : 'Bank account verification rejected',
        ]);
    }
}
