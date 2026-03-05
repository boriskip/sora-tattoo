<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactSettingsController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        $contact = ContactSetting::where('locale', $locale)->first();
        if (!$contact) {
            $contact = ContactSetting::where('locale', 'de')->first();
        }
        return response()->json(['data' => $contact]);
    }

    public function update(Request $request): JsonResponse
    {
        // Normalize empty strings to null so nullable|email passes
        $request->merge([
            'address' => $request->input('address') ? trim((string) $request->input('address')) : null,
            'working_hours' => $request->input('working_hours') ? trim((string) $request->input('working_hours')) : null,
            'phone' => $request->input('phone') ? trim((string) $request->input('phone')) : null,
            'email' => $request->input('email') ? trim((string) $request->input('email')) : null,
        ]);

        $validated = $request->validate([
            'locale' => 'required|string|in:de,en,ru,it',
            'address' => 'nullable|string|max:500',
            'working_hours' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
        ]);

        $locale = $validated['locale'];
        unset($validated['locale']);

        $contact = ContactSetting::where('locale', $locale)->first();
        if (!$contact) {
            $contact = ContactSetting::create(array_merge($validated, ['locale' => $locale]));
            return response()->json(['data' => $contact], 201);
        }

        $contact->update($validated);
        return response()->json(['data' => $contact->fresh()]);
    }
}
