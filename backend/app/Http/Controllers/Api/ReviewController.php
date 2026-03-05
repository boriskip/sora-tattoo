<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (!in_array($locale, ['de', 'en', 'ru', 'it'], true)) {
            $locale = 'de';
        }
        $reviews = Review::where('status', 'approved')
            ->where('locale', $locale)
            ->orderBy('created_at', 'desc')
            ->get();
        if ($reviews->isEmpty() && $locale !== 'de') {
            $reviews = Review::where('status', 'approved')
                ->where('locale', 'de')
                ->orderBy('created_at', 'desc')
                ->get();
        }
        return response()->json(['data' => $reviews]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $locale = $request->get('locale', 'de');
        if (!in_array($locale, ['de', 'en', 'ru', 'it'], true)) {
            $locale = 'de';
        }

        $review = Review::create([
            ...$validated,
            'locale' => $locale,
            'status' => 'pending',
        ]);

        return response()->json(['data' => $review, 'message' => 'Review submitted for moderation'], 201);
    }
}
