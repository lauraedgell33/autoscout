<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// KYC Image serving for Filament admin
Route::middleware('auth:sanctum')->get('/admin/kyc-image/{user_id}/{type}/{filename}', function ($user_id, $type, $filename) {
    if (!auth()->check() || auth()->user()->user_type !== 'admin') {
        abort(403);
    }
    
    $path = "kyc/{$user_id}/{$type}/{$filename}";
    
    if (!Storage::disk('local')->exists($path)) {
        abort(404);
    }
    
    return response()->file(Storage::disk('local')->path($path));
})->name('admin.kyc-image');
