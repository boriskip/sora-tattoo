<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LegalController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        $legal = LegalPage::where('locale', $locale)->first();
        if (!$legal) {
            $legal = LegalPage::where('locale', 'de')->first();
        }
        return response()->json(['data' => $legal]);
    }
}
