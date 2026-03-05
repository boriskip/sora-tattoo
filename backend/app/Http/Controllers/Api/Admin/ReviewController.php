<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Review::query()->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $reviews = $query->get();
        return response()->json(['data' => $reviews]);
    }

    public function show(int $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        return response()->json(['data' => $review]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $validated = $request->validate([
            'author' => 'sometimes|string|max:255',
            'email' => 'sometimes|nullable|email|max:255',
            'text' => 'sometimes|string',
            'rating' => 'sometimes|integer|min:1|max:5',
            'status' => 'sometimes|in:pending,approved',
        ]);

        $review->update($validated);
        return response()->json(['data' => $review]);
    }

    public function destroy(int $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        $review->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }

    public function approve(int $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }
        $review->update(['status' => 'approved']);
        return response()->json(['data' => $review]);
    }
}
