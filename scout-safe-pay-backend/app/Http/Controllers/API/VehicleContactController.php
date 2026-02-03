<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\User;
use App\Notifications\VehicleInquiryNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'phone' => 'required|string|max:50',
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

        // Send notification to seller
        try {
            $recipient->notify(new VehicleInquiryNotification([
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
                'success' => true
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Failed to send vehicle inquiry: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to send inquiry. Please try again later.',
                'success' => false
            ], 500);
        }
    }
}
