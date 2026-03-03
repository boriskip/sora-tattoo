<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\JsonResponse;

class ArtistController extends Controller
{
    /**
     * List all artists (for home page Masters section).
     */
    public function index(): JsonResponse
    {
        $artists = Artist::orderBy('sort_order')->orderBy('id')->get();
        return response()->json(['data' => $artists]);
    }

    /**
     * Get single artist by slug with their works (for artist portfolio page).
     */
    public function show(string $slug): JsonResponse
    {
        $artist = Artist::where('slug', $slug)->with('works')->first();
        if (!$artist) {
            return response()->json(['message' => 'Artist not found'], 404);
        }
        return response()->json(['data' => $artist]);
    }
}
