<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'style',
        'description',
        'avatar',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function works(): HasMany
    {
        return $this->hasMany(Work::class)->orderBy('sort_order')->orderBy('id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ArtistTranslation::class);
    }

    public function getNameForLocale(string $locale): string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->name ?? $this->name ?? $this->slug;
    }

    public function getStyleForLocale(string $locale): ?string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->style ?? $this->style;
    }

    public function getDescriptionForLocale(string $locale): ?string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->description ?? $this->description;
    }
}
