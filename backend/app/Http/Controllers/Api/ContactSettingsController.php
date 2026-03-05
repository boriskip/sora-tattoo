<?php

namespace App\Http\Controllers\Api;

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
}
