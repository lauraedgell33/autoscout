<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Verification::with(['user', 'vehicle', 'reviewer'])
            ->where('user_id', $request->user()->id);

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $verifications = $query->latest()->paginate(15);

        return response()->json($verifications);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:identity,phone,address,vehicle_vin,dealer_business',
            'submitted_data' => 'required|array',
            'document_type' => 'nullable|string',
            'document_number' => 'nullable|string',
            'document_expiry' => 'nullable|date',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'vin_number' => 'nullable|string|size:17',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $verification = Verification::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'status' => 'pending',
            'submitted_data' => $request->submitted_data,
            'document_type' => $request->document_type,
            'document_number' => $request->document_number,
            'document_expiry' => $request->document_expiry,
            'vehicle_id' => $request->vehicle_id,
            'vin_number' => $request->vin_number,
        ]);

        return response()->json([
            'message' => 'Verification submitted successfully',
            'verification' => $verification->load(['user', 'vehicle'])
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $verification = Verification::with(['user', 'vehicle', 'reviewer'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($verification);
    }

    public function checkVin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vin' => 'required|string|size:17',
            'vehicle_id' => 'required|exists:vehicles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mock VIN check (integrate real VIN API here)
        $vinCheckResult = [
            'vin' => $request->vin,
            'valid' => true,
            'make' => 'BMW',
            'model' => '320d',
            'year' => 2020,
            'checked_at' => now(),
        ];

        $verification = Verification::create([
            'user_id' => $request->user()->id,
            'type' => 'vehicle_vin',
            'status' => 'approved',
            'vehicle_id' => $request->vehicle_id,
            'vin_number' => $request->vin,
            'vin_check_result' => $vinCheckResult,
        ]);

        return response()->json([
            'message' => 'VIN verification completed',
            'verification' => $verification,
            'result' => $vinCheckResult
        ]);
    }

    public function myVerifications(Request $request)
    {
        $verifications = Verification::with(['vehicle'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->groupBy('type');

        return response()->json($verifications);
    }

    public function adminIndex(Request $request)
    {
        $query = Verification::with(['user', 'vehicle', 'reviewer']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $verifications = $query->latest()->paginate(20);

        return response()->json($verifications);
    }

    public function adminUpdate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_review,approved,rejected',
            'review_notes' => 'nullable|string',
            'rejection_reason' => 'nullable|string',
            'verification_result' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $verification = Verification::findOrFail($id);

        $verification->update([
            'status' => $request->status,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $request->review_notes,
            'rejection_reason' => $request->rejection_reason,
            'verification_result' => $request->verification_result,
        ]);

        return response()->json([
            'message' => 'Verification updated successfully',
            'verification' => $verification->fresh(['user', 'vehicle', 'reviewer'])
        ]);
    }
}
