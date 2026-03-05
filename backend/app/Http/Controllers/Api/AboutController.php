<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        $about = AboutSection::where('locale', $locale)->orderBy('sort_order')->orderBy('id')->first();
        if (!$about) {
            $about = AboutSection::where('locale', 'de')->orderBy('sort_order')->orderBy('id')->first();
        }
        return response()->json(['data' => $about]);
    }
}
