<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkImage extends Model
{
    protected $fillable = ['work_id', 'image', 'alt', 'sort_order'];

    protected $casts = [
        'work_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(WorkImageTranslation::class, 'work_image_id');
    }

    public function getAltForLocale(string $locale): ?string
    {
        $t = $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', 'de');
        return $t?->alt ?? $this->alt;
    }
}
