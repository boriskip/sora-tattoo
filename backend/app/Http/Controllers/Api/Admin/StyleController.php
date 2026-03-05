<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Style;
use App\Models\StyleImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StyleController extends Controller
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    public function index(): JsonResponse
    {
        $styles = Style::with(['images', 'translations'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        return response()->json(['data' => $styles]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'required|array',
            'translations.de' => 'nullable|array',
            'translations.de.name' => 'nullable|string|max:255',
            'translations.de.description' => 'nullable|string',
            'translations.en' => 'nullable|array',
            'translations.en.name' => 'nullable|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ru' => 'nullable|array',
            'translations.ru.name' => 'nullable|string|max:255',
            'translations.ru.description' => 'nullable|string',
            'translations.it' => 'nullable|array',
            'translations.it.name' => 'nullable|string|max:255',
            'translations.it.description' => 'nullable|string',
        ]);

        $translations = $validated['translations'] ?? [];
        $firstName = null;
        foreach (self::LOCALES as $loc) {
            $name = $translations[$loc]['name'] ?? null;
            if ($name !== null && $name !== '') {
                $firstName = $name;
                break;
            }
        }
        if ($firstName === null) {
            return response()->json(['message' => 'At least one translation name is required.'], 422);
        }

        $slug = !empty($validated['slug']) ? $validated['slug'] : Str::slug($firstName);
        $style = Style::create([
            'slug' => $slug,
            'name' => $firstName,
            'description' => $translations['de']['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $this->syncTranslations($style, $translations);
        return response()->json(['data' => $style->load(['images', 'translations'])], 201);
    }

    public function show(int $id): JsonResponse
    {
        $style = Style::with(['images', 'translations'])->find($id);
        if (!$style) {
            return response()->json(['message' => 'Style not found'], 404);
        }
        return response()->json(['data' => $style]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $style = Style::find($id);
        if (!$style) {
            return response()->json(['message' => 'Style not found'], 404);
        }

        $validated = $request->validate([
            'slug' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'translations' => 'sometimes|array',
            'translations.de' => 'nullable|array',
            'translations.de.name' => 'nullable|string|max:255',
            'translations.de.description' => 'nullable|string',
            'translations.en' => 'nullable|array',
            'translations.en.name' => 'nullable|string|max:255',
            'translations.en.description' => 'nullable|string',
            'translations.ru' => 'nullable|array',
            'translations.ru.name' => 'nullable|string|max:255',
            'translations.ru.description' => 'nullable|string',
            'translations.it' => 'nullable|array',
            'translations.it.name' => 'nullable|string|max:255',
            'translations.it.description' => 'nullable|string',
        ]);

        if (array_key_exists('slug', $validated)) {
            $style->slug = $validated['slug'];
        }
        if (array_key_exists('sort_order', $validated)) {
            $style->sort_order = $validated['sort_order'];
        }
        $style->save();

        if (!empty($validated['translations'])) {
            $this->syncTranslations($style, $validated['translations']);
        }

        return response()->json(['data' => $style->load(['images', 'translations'])]);
    }

    private function syncTranslations(Style $style, array $translations): void
    {
        foreach (self::LOCALES as $locale) {
            $data = $translations[$locale] ?? null;
            $name = $data['name'] ?? null;
            $description = $data['description'] ?? null;
            $rec = $style->translations()->firstWhere('locale', $locale);
            if ($name !== null && $name !== '') {
                if ($rec) {
                    $rec->update(['name' => $name, 'description' => $description]);
                } else {
                    $style->translations()->create([
                        'locale' => $locale,
                        'name' => $name,
                        'description' => $description,
                    ]);
                }
            } elseif ($rec) {
                $rec->delete();
            }
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $style = Style::find($id);
        if (!$style) {
            return response()->json(['message' => 'Style not found'], 404);
        }
        $style->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }

    public function storeImage(Request $request, int $id): JsonResponse
    {
        $style = Style::find($id);
        if (!$style) {
            return response()->json(['message' => 'Style not found'], 404);
        }

        $validated = $request->validate([
            'image' => 'required|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $image = $style->images()->create([
            'image' => $validated['image'],
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json(['data' => $image], 201);
    }

    public function destroyImage(int $styleId, int $imageId): JsonResponse
    {
        $image = StyleImage::where('style_id', $styleId)->find($imageId);
        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        $image->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
