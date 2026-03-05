<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    private function normalizeLocale(?string $locale): string
    {
        return in_array($locale, ['de', 'en', 'ru', 'it'], true) ? $locale : 'de';
    }

    /**
     * List all artists (for home page Masters section).
     * Query: ?locale=de|en|ru|it — returns name, style, description in that language.
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $this->normalizeLocale($request->get('locale'));
        $artists = Artist::with(['works', 'translations'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $data = $artists->map(fn (Artist $a) => [
            'id' => $a->id,
            'slug' => $a->slug,
            'name' => $a->getNameForLocale($locale),
            'style' => $a->getStyleForLocale($locale),
            'description' => $a->getDescriptionForLocale($locale),
            'avatar' => $a->avatar,
            'sort_order' => $a->sort_order,
            'works' => $a->works,
        ]);
        return response()->json(['data' => $data]);
    }

    /**
     * Get single artist by slug with their works (for artist portfolio page).
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $this->normalizeLocale($request->get('locale'));
        $artist = Artist::where('slug', $slug)->with(['works', 'translations'])->first();
        if (!$artist) {
            return response()->json(['message' => 'Artist not found'], 404);
        }
        $data = [
            'id' => $artist->id,
            'slug' => $artist->slug,
            'name' => $artist->getNameForLocale($locale),
            'style' => $artist->getStyleForLocale($locale),
            'description' => $artist->getDescriptionForLocale($locale),
            'avatar' => $artist->avatar,
            'sort_order' => $artist->sort_order,
            'works' => $artist->works,
        ];
        return response()->json(['data' => $data]);
    }
}
