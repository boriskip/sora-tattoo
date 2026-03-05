<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Style extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(StyleImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(StyleTranslation::class);
    }

    /** Get name for locale (from translations, fallback to style.name then slug). */
    public function getNameForLocale(string $locale): string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->name ?? $this->name ?? $this->slug;
    }

    /** Get description for locale (from translations, fallback to style.description). */
    public function getDescriptionForLocale(string $locale): ?string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->description ?? $this->description;
    }
}
