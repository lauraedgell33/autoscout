<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DisputeController extends Controller
{
    public function index(Request $request)
    {
        $query = Dispute::with(['transaction', 'raisedBy', 'resolver'])
            ->where(function($q) use ($request) {
                $q->whereHas('transaction', function($query) use ($request) {
                    $query->where('buyer_id', $request->user()->id)
                          ->orWhere('seller_id', $request->user()->id);
                });
            });

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $disputes = $query->latest()->paginate(15);

        return response()->json($disputes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|exists:transactions,id',
            'type' => 'required|in:payment_not_received,vehicle_condition,missing_documents,fraudulent_listing,other',
            'reason' => 'required|string|max:255',
            'description' => 'required|string',
            'evidence_urls' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transaction = Transaction::findOrFail($request->transaction_id);

        // Check if user is part of transaction
        if ($transaction->buyer_id !== $request->user()->id && 
            $transaction->seller_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if dispute already exists for this transaction
        $existingDispute = Dispute::where('transaction_id', $request->transaction_id)
            ->whereIn('status', ['open', 'in_review', 'investigating', 'awaiting_response'])
            ->first();

        if ($existingDispute) {
            return response()->json(['error' => 'An open dispute already exists for this transaction'], 422);
        }

        $dispute = Dispute::create([
            'transaction_id' => $request->transaction_id,
            'raised_by_user_id' => $request->user()->id,
            'type' => $request->type,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'open',
            'evidence_urls' => $request->evidence_urls,
        ]);

        return response()->json([
            'message' => 'Dispute raised successfully',
            'dispute' => $dispute->load(['transaction', 'raisedBy'])
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $dispute = Dispute::with(['transaction', 'raisedBy', 'resolver'])
            ->findOrFail($id);

        // Check if user is authorized
        if ($dispute->transaction->buyer_id !== $request->user()->id && 
            $dispute->transaction->seller_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($dispute);
    }

    public function addResponse(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'response' => 'required|string',
            'evidence_urls' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dispute = Dispute::findOrFail($id);
        $transaction = $dispute->transaction;

        // Determine if user is buyer or seller
        if ($transaction->buyer_id === $request->user()->id) {
            $dispute->buyer_response = $request->response;
        } elseif ($transaction->seller_id === $request->user()->id) {
            $dispute->seller_response = $request->response;
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($request->evidence_urls) {
            $currentEvidence = $dispute->evidence_urls ?? [];
            $dispute->evidence_urls = array_merge($currentEvidence, $request->evidence_urls);
        }

        $dispute->status = 'awaiting_response';
        $dispute->save();

        return response()->json([
            'message' => 'Response added successfully',
            'dispute' => $dispute->fresh(['transaction', 'raisedBy', 'resolver'])
        ]);
    }

    public function myDisputes(Request $request)
    {
        $disputes = Dispute::with(['transaction'])
            ->whereHas('transaction', function($query) use ($request) {
                $query->where('buyer_id', $request->user()->id)
                      ->orWhere('seller_id', $request->user()->id);
            })
            ->latest()
            ->get()
            ->groupBy('status');

        return response()->json($disputes);
    }

    public function adminIndex(Request $request)
    {
        $query = Dispute::with(['transaction', 'raisedBy', 'resolver']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $disputes = $query->latest()->paginate(20);

        return response()->json($disputes);
    }

    public function adminUpdate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:open,in_review,investigating,awaiting_response,resolved,closed,escalated',
            'resolution' => 'nullable|string',
            'resolution_type' => 'nullable|in:refund_buyer,release_seller,partial_refund,relist_vehicle,dismissed',
            'admin_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dispute = Dispute::findOrFail($id);

        $updateData = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ];

        if (in_array($request->status, ['resolved', 'closed'])) {
            $updateData['resolved_by'] = $request->user()->id;
            $updateData['resolved_at'] = now();
            $updateData['resolution'] = $request->resolution;
            $updateData['resolution_type'] = $request->resolution_type;
        }

        $dispute->update($updateData);

        return response()->json([
            'message' => 'Dispute updated successfully',
            'dispute' => $dispute->fresh(['transaction', 'raisedBy', 'resolver'])
        ]);
    }
}
