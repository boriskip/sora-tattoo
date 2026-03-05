<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Work;
use App\Models\WorkImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WorkController extends Controller
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    public function index(): JsonResponse
    {
        $works = Work::with(['artist', 'images', 'translations', 'images.translations'])
            ->orderBy('artist_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        return response()->json(['data' => $works]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'artist_id' => 'required|integer|exists:artists,id',
            'style' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.title' => 'nullable|string|max:255',
            'translations.en' => 'nullable|array',
            'translations.en.title' => 'nullable|string|max:255',
            'translations.ru' => 'nullable|array',
            'translations.ru.title' => 'nullable|string|max:255',
            'translations.it' => 'nullable|array',
            'translations.it.title' => 'nullable|string|max:255',
        ]);
        $translations = $validated['translations'] ?? [];
        if (empty($translations) && !empty(trim($validated['title'] ?? ''))) {
            $translations['de'] = ['title' => trim($validated['title'])];
        }
        $firstTitle = null;
        foreach (self::LOCALES as $loc) {
            $title = $translations[$loc]['title'] ?? null;
            if ($title !== null && (is_string($title) ? trim($title) : $title) !== '') {
                $firstTitle = is_string($title) ? trim($title) : $title;
                break;
            }
        }
        $work = Work::create([
            'artist_id' => $validated['artist_id'],
            'style' => $validated['style'] ?? null,
            'title' => $firstTitle,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);
        $this->syncWorkTranslations($work, $translations);
        return response()->json(['data' => $work->load(['artist', 'images', 'translations', 'images.translations'])], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $work = Work::find($id);
        if (!$work) {
            return response()->json(['message' => 'Work not found'], 404);
        }
        $validated = $request->validate([
            'artist_id' => 'sometimes|integer|exists:artists,id',
            'style' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.title' => 'nullable|string|max:255',
            'translations.en' => 'nullable|array',
            'translations.en.title' => 'nullable|string|max:255',
            'translations.ru' => 'nullable|array',
            'translations.ru.title' => 'nullable|string|max:255',
            'translations.it' => 'nullable|array',
            'translations.it.title' => 'nullable|string|max:255',
        ]);
        if (array_key_exists('artist_id', $validated)) {
            $work->artist_id = $validated['artist_id'];
        }
        if (array_key_exists('style', $validated)) {
            $work->style = $validated['style'];
        }
        if (array_key_exists('sort_order', $validated)) {
            $work->sort_order = $validated['sort_order'];
        }
        if (array_key_exists('title', $validated) && empty($validated['translations']) && $validated['title'] !== null) {
            $validated['translations'] = ['de' => ['title' => trim($validated['title'])]];
        }
        $work->save();
        if (!empty($validated['translations'])) {
            $this->syncWorkTranslations($work, $validated['translations']);
        }
        return response()->json(['data' => $work->load(['artist', 'images', 'translations', 'images.translations'])]);
    }

    private function syncWorkTranslations(Work $work, array $translations): void
    {
        foreach (self::LOCALES as $locale) {
            $title = $translations[$locale]['title'] ?? null;
            $title = $title !== null ? trim($title) : null;
            $rec = $work->translations()->firstWhere('locale', $locale);
            if ($title !== null && $title !== '') {
                if ($rec) {
                    $rec->update(['title' => $title]);
                } else {
                    $work->translations()->create(['locale' => $locale, 'title' => $title]);
                }
            } elseif ($rec) {
                $rec->delete();
            }
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $work = Work::find($id);
        if (!$work) {
            return response()->json(['message' => 'Work not found'], 404);
        }
        $work->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }

    /** Add image to work (multipart: image, alt?, sort_order?) */
    public function storeImage(Request $request, int $id): JsonResponse
    {
        $work = Work::find($id);
        if (!$work) {
            return response()->json(['message' => 'Work not found'], 404);
        }
        try {
            $request->validate([
                'image' => 'required|file|image|mimes:jpeg,jpg,png,webp|max:5120',
                'alt' => 'nullable|string|max:500',
                'sort_order' => 'nullable|integer|min:0',
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
            $path = $file->store('works', 'public');
            if ($path === false) {
                return response()->json(['message' => 'Не удалось сохранить файл.'], 500);
            }
            $baseUrl = rtrim(config('app.url', 'http://localhost:8001'), '/');
            $url = $baseUrl . '/' . ltrim(Storage::url($path), '/');
            $sortOrder = (int) $request->input('sort_order', $work->images()->count());
            $alt = $request->input('alt');
            $workImage = $work->images()->create([
                'image' => $url,
                'alt' => $alt,
                'sort_order' => $sortOrder,
            ]);
            if ($alt !== null && $alt !== '') {
                $workImage->translations()->create(['locale' => 'de', 'alt' => $alt]);
            }
            return response()->json(['data' => $workImage->load('translations')], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            $message = config('app.debug') ? $e->getMessage() : 'Ошибка загрузки.';
            return response()->json(['message' => $message], 500);
        }
    }

    public function updateImage(Request $request, int $workId, int $imageId): JsonResponse
    {
        $image = WorkImage::where('work_id', $workId)->where('id', $imageId)->first();
        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        $validated = $request->validate([
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.alt' => 'nullable|string|max:500',
            'translations.en' => 'nullable|array',
            'translations.en.alt' => 'nullable|string|max:500',
            'translations.ru' => 'nullable|array',
            'translations.ru.alt' => 'nullable|string|max:500',
            'translations.it' => 'nullable|array',
            'translations.it.alt' => 'nullable|string|max:500',
        ]);
        if (array_key_exists('sort_order', $validated)) {
            $image->sort_order = $validated['sort_order'];
            $image->save();
        }
        if (!empty($validated['translations'])) {
            $this->syncImageTranslations($image, $validated['translations']);
        }
        return response()->json(['data' => $image->load('translations')]);
    }

    private function syncImageTranslations(WorkImage $image, array $translations): void
    {
        foreach (self::LOCALES as $locale) {
            $alt = $translations[$locale]['alt'] ?? null;
            $alt = $alt !== null ? trim($alt) : null;
            $rec = $image->translations()->firstWhere('locale', $locale);
            if ($rec) {
                $rec->update(['alt' => $alt]);
            } elseif ($alt !== null && $alt !== '') {
                $image->translations()->create(['locale' => $locale, 'alt' => $alt]);
            }
        }
    }

    public function destroyImage(int $workId, int $imageId): JsonResponse
    {
        $image = WorkImage::where('work_id', $workId)->where('id', $imageId)->first();
        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        $image->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
