<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;

class LocaleController extends Controller
{
    /**
     * Get available locales
     */
    public function getAvailableLocales()
    {
        return response()->json([
            'locales' => [
                [
                    'code' => 'en',
                    'name' => 'English',
                    'native_name' => 'English',
                    'flag' => '🇬🇧',
                ],
                [
                    'code' => 'de',
                    'name' => 'German',
                    'native_name' => 'Deutsch',
                    'flag' => '🇩🇪',
                ],
                [
                    'code' => 'es',
                    'name' => 'Spanish',
                    'native_name' => 'Español',
                    'flag' => '🇪🇸',
                ],
                [
                    'code' => 'it',
                    'name' => 'Italian',
                    'native_name' => 'Italiano',
                    'flag' => '🇮🇹',
                ],
                [
                    'code' => 'ro',
                    'name' => 'Romanian',
                    'native_name' => 'Română',
                    'flag' => '🇷🇴',
                ],
                [
                    'code' => 'fr',
                    'name' => 'French',
                    'native_name' => 'Français',
                    'flag' => '🇫🇷',
                ],
            ],
            'current' => App::getLocale(),
        ]);
    }
    
    /**
     * Get current locale
     */
    public function getCurrentLocale()
    {
        return response()->json([
            'locale' => App::getLocale(),
        ]);
    }
    
    /**
     * Set user locale
     */
    public function setLocale(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'locale' => 'required|string|in:en,de,es,it,ro,fr',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid locale',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $locale = $request->input('locale');
        
        // Set application locale
        App::setLocale($locale);
        
        // Store in session
        session(['locale' => $locale]);
        
        // Update user preference if authenticated
        if ($request->user()) {
            $request->user()->update(['locale' => $locale]);
        }
        
        return response()->json([
            'message' => 'Locale updated successfully',
            'locale' => $locale,
        ]);
    }
    
    /**
     * Get translations for a specific key
     */
    public function getTranslations(Request $request, string $file)
    {
        $locale = App::getLocale();
        $translations = trans($file, [], $locale);
        
        return response()->json([
            'locale' => $locale,
            'file' => $file,
            'translations' => $translations,
        ]);
    }
}
