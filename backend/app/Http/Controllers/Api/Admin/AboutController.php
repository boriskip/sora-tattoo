<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => 'required|string|in:de,en,ru,it',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.url' => 'required|string|max:500',
            'images.*.alt' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $locale = $validated['locale'];
        unset($validated['locale']);

        if (array_key_exists('images', $validated)) {
            AboutSection::whereIn('locale', ['de', 'en', 'ru', 'it'])->update(['images' => $validated['images']]);
        }

        $about = AboutSection::where('locale', $locale)->first();
        if (!$about) {
            $about = AboutSection::create(array_merge($validated, ['locale' => $locale]));
            return response()->json(['data' => $about], 201);
        }

        $about->update($validated);
        return response()->json(['data' => $about]);
    }

    /**
     * Upload one image for About slider. Returns URL to add to images array.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|file|image|mimes:jpeg,jpg,png,webp|max:5120',
            ], [
                'image.required' => 'Выберите файл.',
                'image.image' => 'Файл должен быть изображением.',
                'image.mimes' => 'Допустимы форматы: JPEG, PNG, WebP.',
                'image.max' => 'Размер файла не более 5 МБ.',
            ]);

            $file = $request->file('image');
            if (!$file || !$file->isValid()) {
                return response()->json(['message' => 'Неверный или отсутствующий файл.'], 422);
            }

            $path = $file->store('about', 'public');
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
