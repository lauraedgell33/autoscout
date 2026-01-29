<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index(): JsonResponse
    {
        $settings = Settings::all()->pluck('value', 'key');
        
        return response()->json([
            'settings' => $settings
        ]);
    }

    /**
     * Get frontend-specific settings
     */
    public function frontendSettings(): JsonResponse
    {
        $settings = Settings::whereIn('key', [
            'site_name',
            'site_description',
            'site_logo',
            'primary_color',
            'secondary_color',
            'currency',
            'language',
            'timezone',
            'maintenance_mode',
        ])->get()->pluck('value', 'key');

        return response()->json([
            'site_name' => $settings['site_name'] ?? 'AutoScout SafePay',
            'site_description' => $settings['site_description'] ?? 'Safe Vehicle Trading Platform',
            'site_logo' => $settings['site_logo'] ?? '/logo.png',
            'primary_color' => $settings['primary_color'] ?? '#3B82F6',
            'secondary_color' => $settings['secondary_color'] ?? '#10B981',
            'currency' => $settings['currency'] ?? 'EUR',
            'language' => $settings['language'] ?? 'en',
            'timezone' => $settings['timezone'] ?? 'UTC',
            'maintenance_mode' => (bool) ($settings['maintenance_mode'] ?? false),
        ]);
    }

    /**
     * Get contact settings
     */
    public function contactSettings(): JsonResponse
    {
        $settings = Settings::whereIn('key', [
            'contact_email',
            'contact_phone',
            'contact_address',
            'support_email',
            'support_hours',
        ])->get()->pluck('value', 'key');

        return response()->json([
            'contact_email' => $settings['contact_email'] ?? 'contact@autoscout.com',
            'contact_phone' => $settings['contact_phone'] ?? '+40 123 456 789',
            'contact_address' => $settings['contact_address'] ?? 'Bucharest, Romania',
            'support_email' => $settings['support_email'] ?? 'support@autoscout.com',
            'support_hours' => $settings['support_hours'] ?? '9:00 - 18:00 (Mon-Fri)',
        ]);
    }
}
