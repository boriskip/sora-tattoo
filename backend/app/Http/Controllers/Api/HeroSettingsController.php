<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroSettingsController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        $hero = HeroSetting::where('locale', $locale)->first();
        if (!$hero) {
            $hero = HeroSetting::where('locale', 'de')->first();
        }
        return response()->json(['data' => $hero]);
    }
}
