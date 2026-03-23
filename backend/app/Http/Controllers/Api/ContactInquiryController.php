<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\BookingInquiryMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactInquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->filled('website')) {
            return response()->json(['message' => 'OK'], 200);
        }

        $request->merge([
            'preferred_date' => $request->input('preferred_date') ?: null,
            'body_part' => $request->input('body_part') !== '' ? $request->input('body_part') : null,
            'style' => $request->input('style') !== '' ? $request->input('style') : null,
            'artist' => $request->input('artist') !== '' ? $request->input('artist') : null,
            'message' => $request->input('message') !== '' ? $request->input('message') : null,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:500',
            'body_part' => 'nullable|string|max:255',
            'style' => 'nullable|string|max:100',
            'artist' => 'nullable|string|max:255',
            'preferred_date' => 'nullable|date_format:Y-m-d',
            'message' => 'nullable|string|max:5000',
            'locale' => 'sometimes|in:de,en,ru,it',
        ]);

        $to = config('contact.mail_to');
        if (! is_string($to) || $to === '' || ! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            Log::error('Contact inquiry: invalid CONTACT_MAIL_TO');

            return response()->json(['message' => 'Service misconfigured.'], 503);
        }

        try {
            Mail::to($to)->send(new BookingInquiryMail($validated));
        } catch (\Throwable $e) {
            Log::error('Contact inquiry mail failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Could not send message. Please try again later.'], 503);
        }

        return response()->json(['message' => 'Inquiry sent'], 201);
    }
}
