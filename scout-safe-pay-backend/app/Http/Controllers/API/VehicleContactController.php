<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Vehicle;
use App\Models\User;
use App\Notifications\VehicleInquiryNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class VehicleContactController extends Controller
{
    /**
     * Send contact message to vehicle seller/dealer
     */
    public function sendInquiry(Request $request, $vehicleId)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:2000',
            'requestType' => 'required|in:inquiry,test-drive,offer,inspection',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::with(['seller', 'dealer'])->find($vehicleId);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        // Determine recipient (dealer or seller)
        $recipient = $vehicle->dealer ? $vehicle->dealer->user : $vehicle->seller;

        if (!$recipient) {
            return response()->json(['message' => 'Seller contact not found'], 404);
        }

        try {
            // Save inquiry to database
            $inquiry = Inquiry::create([
                'vehicle_id' => $vehicle->id,
                'user_id' => auth()->id(), // null if not logged in
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => $request->message,
                'request_type' => $request->requestType,
                'status' => 'new',
            ]);

            Log::info('Inquiry saved', ['inquiry_id' => $inquiry->id, 'vehicle_id' => $vehicle->id]);

            // Send notification to seller
            $recipient->notify(new VehicleInquiryNotification([
                'inquiry_id' => $inquiry->id,
                'vehicle_id' => $vehicle->id,
                'vehicle_title' => "{$vehicle->make} {$vehicle->model} ({$vehicle->year})",
                'from_name' => $request->name,
                'from_email' => $request->email,
                'from_phone' => $request->phone,
                'message' => $request->message,
                'request_type' => $request->requestType,
            ]));

            return response()->json([
                'message' => 'Your inquiry has been sent successfully',
                'success' => true,
                'inquiry_id' => $inquiry->id,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to send vehicle inquiry: ' . $e->getMessage(), [
                'vehicle_id' => $vehicleId,
                'email' => $request->email,
            ]);
            
            return response()->json([
                'message' => 'Failed to send inquiry. Please try again later.',
                'success' => false
            ], 500);
        }
    }

    /**
     * Get all inquiries for admin
     */
    public function index(Request $request)
    {
        $inquiries = Inquiry::with(['vehicle', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($inquiries);
    }

    /**
     * Get single inquiry
     */
    public function show($id)
    {
        $inquiry = Inquiry::with(['vehicle', 'user'])->findOrFail($id);
        
        // Mark as read
        $inquiry->markAsRead();
        
        return response()->json($inquiry);
    }

    /**
     * Update inquiry status
     */
    public function updateStatus(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,read,replied,closed',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $inquiry->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        if ($request->status === 'replied') {
            $inquiry->markAsReplied();
        }

        return response()->json([
            'message' => 'Inquiry updated successfully',
            'inquiry' => $inquiry,
        ]);
    }
}
