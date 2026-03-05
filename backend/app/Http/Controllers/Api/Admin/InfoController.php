<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfoGuide;
use App\Models\InfoGuideImage;
use App\Models\InfoGuideTranslation;
use App\Models\InfoSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InfoController extends Controller
{
    private const LOCALES = ['de', 'en', 'ru', 'it'];

    public function index(): JsonResponse
    {
        $sections = InfoSection::orderBy('sort_order')->orderBy('id')->get();
        $guides = InfoGuide::with(['translations', 'images'])->orderBy('sort_order')->orderBy('id')->get();
        return response()->json([
            'data' => [
                'sections' => $sections,
                'guides' => $guides,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sections' => 'sometimes|array',
            'sections.*.locale' => 'required|string|in:de,en,ru,it',
            'sections.*.title' => 'nullable|string|max:255',
            'guides' => 'sometimes|array',
            'guides.*.id' => 'nullable|integer',
            'guides.*.slug' => 'required|string|max:100',
            'guides.*.sort_order' => 'nullable|integer|min:0',
            'guides.*.translations' => 'sometimes|array',
            'guides.*.translations.de' => 'nullable|array',
            'guides.*.translations.de.title' => 'nullable|string|max:500',
            'guides.*.translations.de.content' => 'nullable|string',
            'guides.*.translations.en' => 'nullable|array',
            'guides.*.translations.en.title' => 'nullable|string|max:500',
            'guides.*.translations.en.content' => 'nullable|string',
            'guides.*.translations.ru' => 'nullable|array',
            'guides.*.translations.ru.title' => 'nullable|string|max:500',
            'guides.*.translations.ru.content' => 'nullable|string',
            'guides.*.translations.it' => 'nullable|array',
            'guides.*.translations.it.title' => 'nullable|string|max:500',
            'guides.*.translations.it.content' => 'nullable|string',
            'guides.*.images' => 'sometimes|array',
            'guides.*.images.*.image' => 'required|string|max:500',
            'guides.*.images.*.alt' => 'nullable|string|max:500',
            'guides.*.images.*.sort_order' => 'nullable|integer|min:0',
        ]);

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $s) {
                InfoSection::updateOrCreate(
                    ['locale' => $s['locale']],
                    ['title' => $s['title'] ?? null, 'sort_order' => $s['sort_order'] ?? 0]
                );
            }
        }

        $keepIds = [];
        if (!empty($validated['guides'])) {
            foreach ($validated['guides'] as $g) {
                $id = isset($g['id']) ? (int) $g['id'] : null;
                $guide = $id ? InfoGuide::find($id) : null;
                if (!$guide) {
                    $guide = InfoGuide::create([
                        'slug' => trim($g['slug']) ?: 'guide-' . uniqid(),
                        'sort_order' => (int) ($g['sort_order'] ?? 0),
                    ]);
                } else {
                    $guide->slug = trim($g['slug']) ?: $guide->slug;
                    if (isset($g['sort_order'])) {
                        $guide->sort_order = (int) $g['sort_order'];
                    }
                    $guide->save();
                }
                $keepIds[] = $guide->id;

                if (!empty($g['translations'])) {
                    foreach (self::LOCALES as $loc) {
                        $t = $g['translations'][$loc] ?? null;
                        if (!$t) continue;
                        $title = isset($t['title']) ? trim($t['title']) : null;
                        $content = array_key_exists('content', $t) ? $t['content'] : null;
                        $rec = $guide->translations()->firstWhere('locale', $loc);
                        if ($title !== null && $title !== '') {
                            if ($rec) {
                                $rec->update(['title' => $title, 'content' => $content]);
                            } else {
                                $guide->translations()->create([
                                    'locale' => $loc,
                                    'title' => $title,
                                    'content' => $content,
                                ]);
                            }
                        } elseif ($rec) {
                            $rec->delete();
                        }
                    }
                }
                if (array_key_exists('images', $g)) {
                    $guide->images()->delete();
                    foreach ($g['images'] as $idx => $img) {
                        $guide->images()->create([
                            'image' => $img['image'],
                            'alt' => isset($img['alt']) ? trim($img['alt']) : null,
                            'sort_order' => (int) ($img['sort_order'] ?? $idx),
                        ]);
                    }
                }
            }
            InfoGuide::whereNotIn('id', $keepIds)->delete();
        }

        return $this->index();
    }

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
            $path = $file->store('info', 'public');
            if ($path === false) {
                return response()->json(['message' => 'Не удалось сохранить файл.'], 500);
            }
            $baseUrl = rtrim(config('app.url', 'http://localhost:8001'), '/');
            $url = $baseUrl . '/' . ltrim(Storage::url($path), '/');
            return response()->json(['url' => $url, 'path' => $path]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            return response()->json(['message' => config('app.debug') ? $e->getMessage() : 'Ошибка загрузки.'], 500);
        }
    }
}
