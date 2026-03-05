<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InfoGuide;
use App\Models\InfoSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InfoController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (!in_array($locale, ['de', 'en', 'ru', 'it'], true)) {
            $locale = 'de';
        }
        $section = InfoSection::where('locale', $locale)->first()
            ?? InfoSection::where('locale', 'de')->first();
        $guides = InfoGuide::with(['translations', 'images'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $guidesData = $guides->map(function (InfoGuide $guide) use ($locale) {
            return [
                'slug' => $guide->slug,
                'title' => $guide->getTitleForLocale($locale),
                'content' => $guide->getContentForLocale($locale),
                'images' => $guide->images->map(fn ($img) => [
                    'url' => $img->image,
                    'alt' => $img->alt,
                ]),
            ];
        });
        $data = [
            'title' => $section?->title ?? 'Information',
            'guides' => $guidesData,
        ];
        return response()->json(['data' => $data]);
    }
}
