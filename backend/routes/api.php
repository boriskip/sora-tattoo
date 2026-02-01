<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API Routes will be added here
Route::get('/test', function () {
    return response()->json(['message' => 'Sora Tattoo API is working!']);
});

