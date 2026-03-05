<?php

namespace App\Http\Controllers\Api\Admin;

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

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => 'required|string|in:de,en,ru,it',
            'impressum_title' => 'nullable|string|max:255',
            'impressum_content' => 'nullable|string|max:10000',
            'privacy_title' => 'nullable|string|max:255',
            'privacy_content' => 'nullable|string|max:10000',
        ]);

        $locale = $validated['locale'];
        unset($validated['locale']);

        $legal = LegalPage::where('locale', $locale)->first();
        if (!$legal) {
            $legal = LegalPage::create(array_merge($validated, ['locale' => $locale]));
            return response()->json(['data' => $legal], 201);
        }

        $legal->update($validated);
        return response()->json(['data' => $legal->fresh()]);
    }
}
