<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InfoGuide extends Model
{
    protected $fillable = ['slug', 'sort_order'];

    protected $casts = ['sort_order' => 'integer'];

    public function translations(): HasMany
    {
        return $this->hasMany(InfoGuideTranslation::class, 'info_guide_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(InfoGuideImage::class, 'info_guide_id')->orderBy('sort_order')->orderBy('id');
    }

    public function getTitleForLocale(string $locale): string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->title ?? $this->slug;
    }

    public function getContentForLocale(string $locale): ?string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->content;
    }
}
