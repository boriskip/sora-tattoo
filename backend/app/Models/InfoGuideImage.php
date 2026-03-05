<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfoGuideImage extends Model
{
    protected $fillable = ['image', 'alt', 'sort_order'];

    protected $casts = ['sort_order' => 'integer'];

    public function infoGuide(): BelongsTo
    {
        return $this->belongsTo(InfoGuide::class, 'info_guide_id');
    }
}
