<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use App\Notifications\PasswordResetNotification;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => 'required|in:buyer,seller',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|size:2',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => $validated['user_type'],
            'phone' => $validated['phone'] ?? null,
            'country' => $validated['country'] ?? 'DE',
            // email_verified_at is null by default - user must verify
        ]);

        // Generate verification token and send email
        $verificationToken = Str::random(64);
        Cache::put('email_verification_' . $verificationToken, $user->id, now()->addHours(24));
        
        try {
            $user->notify(new EmailVerificationNotification($verificationToken));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'email_verification_required' => true,
        ], 201);
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        $userId = Cache::get('email_verification_' . $request->token);

        if (!$userId) {
            return response()->json([
                'message' => 'Invalid or expired verification token',
            ], 422);
        }

        $user = User::where('id', $userId)
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified',
                'user' => $user,
            ]);
        }

        $user->update([
            'email_verified_at' => now(),
        ]);

        // Clear the token
        Cache::forget('email_verification_' . $request->token);

        // Create a fresh token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified',
            ]);
        }

        // Generate new verification token
        $verificationToken = Str::random(64);
        Cache::put('email_verification_' . $verificationToken, $user->id, now()->addHours(24));

        try {
            $user->notify(new EmailVerificationNotification($verificationToken));
            return response()->json([
                'message' => 'Verification email sent successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send verification email. Please try again later.',
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load(['dealer', 'primaryBankAccount']),
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        
        if ($token) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        $request->user()->tokens()->delete();
        
        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'country' => 'nullable|string|size:2',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $request->user()->load(['dealer', 'primaryBankAccount']),
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Revoke all tokens to force re-login
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Password is incorrect',
            ], 422);
        }

        // Soft delete the user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }

    /**
     * Send password reset email
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success even if user doesn't exist (security best practice)
            return response()->json([
                'message' => 'If an account exists with this email, you will receive a password reset link.',
            ]);
        }

        // Generate reset token
        $token = Str::random(64);
        Cache::put('password_reset_' . $token, $user->id, now()->addHours(1));

        try {
            $user->notify(new PasswordResetNotification($token));
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send reset email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'If an account exists with this email, you will receive a password reset link.',
        ]);
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $userId = Cache::get('password_reset_' . $request->token);

        if (!$userId) {
            return response()->json([
                'message' => 'Invalid or expired reset token',
            ], 422);
        }

        $user = User::where('id', $userId)
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid email address',
            ], 422);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Clear the token
        Cache::forget('password_reset_' . $request->token);

        // Revoke all existing tokens
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password reset successfully. You can now login with your new password.',
        ]);
    }

    /**
     * Get dashboard data
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Get transaction statistics
        $transactions = Transaction::where(function($q) use ($user) {
            $q->where('buyer_id', $user->id)
              ->orWhere('seller_id', $user->id);
        })->get();

        $activeTransactions = $transactions->whereIn('status', ['pending_payment', 'payment_received', 'inspection_scheduled'])->count();
        $completedTransactions = $transactions->where('status', 'funds_released')->count();

        // Calculate total balance (simplified - in escrow funds)
        $totalBalance = $transactions->whereIn('status', ['payment_received', 'inspection_scheduled', 'inspection_completed'])
            ->sum('amount');

        // Get recent transactions
        $recentTransactions = Transaction::with(['vehicle', 'buyer', 'seller'])
            ->where(function($q) use ($user) {
                $q->where('buyer_id', $user->id)
                  ->orWhere('seller_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_balance' => number_format($totalBalance, 2),
                'active_transactions' => $activeTransactions,
                'completed_transactions' => $completedTransactions,
            ],
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
