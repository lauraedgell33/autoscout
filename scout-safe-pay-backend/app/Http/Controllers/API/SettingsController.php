<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Get all public settings for frontend
     */
    public function public(): JsonResponse
    {
        $settings = Settings::getPublic();
        
        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Get settings by group (only public ones)
     */
    public function group(string $group): JsonResponse
    {
        $settings = Settings::where('group', $group)
            ->where('is_public', true)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => Settings::castValue($setting->value, $setting->type)];
            });
        
        return response()->json([
            'success' => true,
            'group' => $group,
            'data' => $settings,
        ]);
    }
}
