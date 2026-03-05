<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArtistController extends Controller
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    public function index(): JsonResponse
    {
        $artists = Artist::with(['works', 'translations'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        return response()->json(['data' => $artists]);
    }

    public function show(int $id): JsonResponse
    {
        $artist = Artist::with(['works', 'translations'])->find($id);
        if (!$artist) {
            return response()->json(['message' => 'Artist not found'], 404);
        }
        return response()->json(['data' => $artist]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:100|unique:artists,slug',
            'style' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'avatar' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.name' => 'nullable|string|max:255',
            'translations.de.style' => 'nullable|string|max:255',
            'translations.de.description' => 'nullable|string',
            'translations.en' => 'nullable|array',
            'translations.en.name' => 'nullable|string|max:255',
            'translations.en.style' => 'nullable|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ru' => 'nullable|array',
            'translations.ru.name' => 'nullable|string|max:255',
            'translations.ru.style' => 'nullable|string|max:255',
            'translations.ru.description' => 'nullable|string',
            'translations.it' => 'nullable|array',
            'translations.it.name' => 'nullable|string|max:255',
            'translations.it.style' => 'nullable|string|max:255',
            'translations.it.description' => 'nullable|string',
        ]);
        $translations = $validated['translations'] ?? [];
        if (empty($translations) && !empty(trim($validated['name'] ?? ''))) {
            $translations['de'] = [
                'name' => trim($validated['name']),
                'style' => $validated['style'] ?? null,
                'description' => $validated['description'] ?? null,
            ];
        }
        $first = null;
        foreach (self::LOCALES as $loc) {
            $name = $translations[$loc]['name'] ?? null;
            if ($name !== null && trim($name) !== '') {
                $first = trim($name);
                break;
            }
        }
        if ($first === null) {
            return response()->json(['message' => 'At least one translation name is required.'], 422);
        }
        $slug = !empty($validated['slug']) ? $validated['slug'] : Str::slug($first);
        $artist = Artist::create([
            'slug' => $slug,
            'name' => $first,
            'style' => $translations['de']['style'] ?? null,
            'description' => $translations['de']['description'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);
        $this->syncTranslations($artist, $translations);
        return response()->json(['data' => $artist->load(['works', 'translations'])], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $artist = Artist::find($id);
        if (!$artist) {
            return response()->json(['message' => 'Artist not found'], 404);
        }
        $validated = $request->validate([
            'slug' => 'nullable|string|max:100|unique:artists,slug,' . $id,
            'avatar' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.name' => 'nullable|string|max:255',
            'translations.de.style' => 'nullable|string|max:255',
            'translations.de.description' => 'nullable|string',
            'translations.en' => 'nullable|array',
            'translations.en.name' => 'nullable|string|max:255',
            'translations.en.style' => 'nullable|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ru' => 'nullable|array',
            'translations.ru.name' => 'nullable|string|max:255',
            'translations.ru.style' => 'nullable|string|max:255',
            'translations.ru.description' => 'nullable|string',
            'translations.it' => 'nullable|array',
            'translations.it.name' => 'nullable|string|max:255',
            'translations.it.style' => 'nullable|string|max:255',
            'translations.it.description' => 'nullable|string',
        ]);
        if (array_key_exists('slug', $validated)) {
            $artist->slug = $validated['slug'];
        }
        if (array_key_exists('avatar', $validated)) {
            $artist->avatar = $validated['avatar'];
        }
        if (array_key_exists('sort_order', $validated)) {
            $artist->sort_order = $validated['sort_order'];
        }
        $artist->save();
        if (!empty($validated['translations'])) {
            $this->syncTranslations($artist, $validated['translations']);
        }
        return response()->json(['data' => $artist->load(['works', 'translations'])]);
    }

    private function syncTranslations(Artist $artist, array $translations): void
    {
        foreach (self::LOCALES as $locale) {
            $name = isset($translations[$locale]['name']) ? trim($translations[$locale]['name']) : null;
            $style = isset($translations[$locale]['style']) ? trim($translations[$locale]['style']) : null;
            $description = isset($translations[$locale]['description']) ? trim($translations[$locale]['description']) : null;
            $rec = $artist->translations()->firstWhere('locale', $locale);
            if ($name !== null && $name !== '') {
                if ($rec) {
                    $rec->update(['name' => $name, 'style' => $style ?: null, 'description' => $description ?: null]);
                } else {
                    $artist->translations()->create([
                        'locale' => $locale,
                        'name' => $name,
                        'style' => $style ?: null,
                        'description' => $description ?: null,
                    ]);
                }
            } elseif ($rec) {
                $rec->delete();
            }
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $artist = Artist::find($id);
        if (!$artist) {
            return response()->json(['message' => 'Artist not found'], 404);
        }
        $artist->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'avatar' => 'required|file|image|mimes:jpeg,jpg,png,webp|max:5120',
            ], [
                'avatar.required' => 'Выберите файл.',
                'avatar.image' => 'Файл должен быть изображением.',
                'avatar.mimes' => 'Допустимы форматы: JPEG, PNG, WebP.',
                'avatar.max' => 'Размер файла не более 5 МБ.',
            ]);
            $file = $request->file('avatar');
            if (!$file || !$file->isValid()) {
                return response()->json(['message' => 'Неверный или отсутствующий файл.'], 422);
            }
            $path = $file->store('artists', 'public');
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
