<?php

use App\Http\Controllers\Api\ArtistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json(['message' => 'Sora Tattoo API is working!']);
});

Route::get('/artists', [ArtistController::class, 'index']);
Route::get('/artists/{slug}', [ArtistController::class, 'show']);

