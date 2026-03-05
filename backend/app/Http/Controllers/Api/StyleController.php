<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Style;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StyleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (!in_array($locale, ['de', 'en', 'ru', 'it'], true)) {
            $locale = 'de';
        }
        $styles = Style::with(['images', 'translations'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $data = $styles->map(function (Style $style) use ($locale) {
            return [
                'id' => $style->id,
                'slug' => $style->slug,
                'name' => $style->getNameForLocale($locale),
                'description' => $style->getDescriptionForLocale($locale),
                'sort_order' => $style->sort_order,
                'images' => $style->images,
            ];
        });
        return response()->json(['data' => $data]);
    }
}
