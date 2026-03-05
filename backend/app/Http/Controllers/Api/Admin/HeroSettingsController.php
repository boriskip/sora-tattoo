<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => 'required|string|in:de,en,ru,it',
            'background_image' => 'nullable|string|max:500',
            'social_icons_theme' => 'nullable|in:light,dark',
            'title_main' => 'nullable|string|max:255',
            'title_sub' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'facebook_url' => 'nullable|string|url|max:500',
            'instagram_url' => 'nullable|string|url|max:500',
            'whatsapp_url' => 'nullable|string|url|max:500',
            'block1_color' => 'nullable|string|max:20',
            'block2_color' => 'nullable|string|max:20',
        ]);

        $locale = $validated['locale'];
        unset($validated['locale']);

        $visualFields = ['background_image', 'social_icons_theme', 'block1_color', 'block2_color'];
        $visualData = array_intersect_key($validated, array_flip($visualFields));
        if (!empty($visualData)) {
            HeroSetting::whereIn('locale', ['de', 'en', 'ru', 'it'])->update($visualData);
        }

        $hero = HeroSetting::where('locale', $locale)->first();
        if (!$hero) {
            $hero = HeroSetting::create(array_merge($validated, ['locale' => $locale]));
            return response()->json(['data' => $hero], 201);
        }

        $hero->update($validated);
        return response()->json(['data' => $hero]);
    }

    /**
     * Upload hero background image (from file). Returns URL to store in background_image.
     */
    public function uploadBackground(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'background' => 'required|file|image|mimes:jpeg,jpg,png,webp|max:5120',
            ], [
                'background.required' => 'Выберите файл.',
                'background.image' => 'Файл должен быть изображением.',
                'background.mimes' => 'Допустимы форматы: JPEG, PNG, WebP.',
                'background.max' => 'Размер файла не более 5 МБ.',
            ]);

            $file = $request->file('background');
            if (!$file || !$file->isValid()) {
                return response()->json(['message' => 'Неверный или отсутствующий файл.'], 422);
            }

            $path = $file->store('hero', 'public');
            if ($path === false) {
                return response()->json(['message' => 'Не удалось сохранить файл.'], 500);
            }

            $baseUrl = rtrim(config('app.url', 'http://localhost:8001'), '/');
            $url = $baseUrl . '/' . ltrim(Storage::url($path), '/');

            return response()->json(['url' => $url, 'path' => $path]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            $message = config('app.debug') ? $e->getMessage() : 'Ошибка загрузки.';
            return response()->json(['message' => $message], 500);
        }
    }
}
