<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\Admin\AboutController as AdminAboutController;
use App\Http\Controllers\Api\Admin\ArtistController as AdminArtistController;
use App\Http\Controllers\Api\Admin\ContactSettingsController as AdminContactSettingsController;
use App\Http\Controllers\Api\Admin\HeroSettingsController as AdminHeroSettingsController;
use App\Http\Controllers\Api\Admin\InfoController as AdminInfoController;
use App\Http\Controllers\Api\Admin\LegalController as AdminLegalController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\StyleController as AdminStyleController;
use App\Http\Controllers\Api\Admin\WorkController as AdminWorkController;
use App\Http\Controllers\Api\ArtistController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\ContactSettingsController;
use App\Http\Controllers\Api\HeroSettingsController;
use App\Http\Controllers\Api\InfoController;
use App\Http\Controllers\Api\LegalController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\StyleController;
use App\Http\Controllers\Api\WorkController;
use Illuminate\Support\Facades\Route;

// Auth: login (public), logout + user (protected)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json(['message' => 'Sora Tattoo API is working!']);
});

// Public: Artists & Works
Route::get('/artists', [ArtistController::class, 'index']);
Route::get('/artists/{slug}', [ArtistController::class, 'show']);
Route::get('/works', [WorkController::class, 'index']);

// Public: Hero, About, Styles, Reviews
Route::get('/hero-settings', [HeroSettingsController::class, 'show']);
Route::get('/about', [AboutController::class, 'show']);
Route::get('/styles', [StyleController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/info', [InfoController::class, 'show']);
Route::get('/contact-settings', [ContactSettingsController::class, 'show']);
Route::post('/contact-inquiry', [ContactInquiryController::class, 'store'])
    ->middleware('throttle:10,1');
Route::get('/legal', [LegalController::class, 'show']);

// Admin (protected by auth:sanctum)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/hero-settings', [AdminHeroSettingsController::class, 'show']);
    Route::put('/hero-settings', [AdminHeroSettingsController::class, 'update']);
    Route::post('/hero-settings/upload-background', [AdminHeroSettingsController::class, 'uploadBackground']);

    Route::get('/contact-settings', [AdminContactSettingsController::class, 'show']);
    Route::put('/contact-settings', [AdminContactSettingsController::class, 'update']);

    Route::get('/legal', [AdminLegalController::class, 'show']);
    Route::put('/legal', [AdminLegalController::class, 'update']);

    Route::get('/about', [AdminAboutController::class, 'show']);
    Route::put('/about', [AdminAboutController::class, 'update']);
    Route::post('/about/upload-image', [AdminAboutController::class, 'uploadImage']);

    Route::get('/info', [AdminInfoController::class, 'index']);
    Route::put('/info', [AdminInfoController::class, 'update']);
    Route::post('/info/upload-image', [AdminInfoController::class, 'uploadImage']);

    Route::get('/artists', [AdminArtistController::class, 'index']);
    Route::post('/artists', [AdminArtistController::class, 'store']);
    Route::post('/artists/upload-avatar', [AdminArtistController::class, 'uploadAvatar']);
    Route::get('/artists/{id}', [AdminArtistController::class, 'show']);
    Route::put('/artists/{id}', [AdminArtistController::class, 'update']);
    Route::delete('/artists/{id}', [AdminArtistController::class, 'destroy']);

    Route::get('/works', [AdminWorkController::class, 'index']);
    Route::post('/works', [AdminWorkController::class, 'store']);
    Route::post('/works/{id}/images', [AdminWorkController::class, 'storeImage']);
    Route::put('/works/{workId}/images/{imageId}', [AdminWorkController::class, 'updateImage']);
    Route::delete('/works/{workId}/images/{imageId}', [AdminWorkController::class, 'destroyImage']);
    Route::put('/works/{id}', [AdminWorkController::class, 'update']);
    Route::delete('/works/{id}', [AdminWorkController::class, 'destroy']);

    Route::get('/styles', [AdminStyleController::class, 'index']);
    Route::post('/styles', [AdminStyleController::class, 'store']);
    Route::get('/styles/{id}', [AdminStyleController::class, 'show']);
    Route::put('/styles/{id}', [AdminStyleController::class, 'update']);
    Route::delete('/styles/{id}', [AdminStyleController::class, 'destroy']);
    Route::post('/styles/{id}/images', [AdminStyleController::class, 'storeImage']);
    Route::delete('/styles/{styleId}/images/{imageId}', [AdminStyleController::class, 'destroyImage']);

    Route::get('/reviews', [AdminReviewController::class, 'index']);
    Route::get('/reviews/{id}', [AdminReviewController::class, 'show']);
    Route::put('/reviews/{id}', [AdminReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [AdminReviewController::class, 'destroy']);
    Route::post('/reviews/{id}/approve', [AdminReviewController::class, 'approve']);
});
