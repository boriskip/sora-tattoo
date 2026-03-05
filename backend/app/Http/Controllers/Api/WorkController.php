<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    /**
     * List all works with artist (for home page horizontal scroll + gallery).
     * Query: ?locale=de|en|ru|it — returns title and image alt in that language.
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (!in_array($locale, ['de', 'en', 'ru', 'it'], true)) {
            $locale = 'de';
        }
        $works = Work::with(['artist', 'images.translations', 'translations'])
            ->orderBy('artist_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $data = $works->map(function (Work $work) use ($locale) {
            return [
                'id' => $work->id,
                'artist_id' => $work->artist_id,
                'style' => $work->style,
                'title' => $work->getTitleForLocale($locale),
                'sort_order' => $work->sort_order,
                'artist' => $work->artist,
                'images' => $work->images->map(fn ($img) => [
                    'id' => $img->id,
                    'work_id' => $img->work_id,
                    'image' => $img->image,
                    'alt' => $img->getAltForLocale($locale),
                    'sort_order' => $img->sort_order,
                ]),
            ];
        });
        return response()->json(['data' => $data]);
    }
}
