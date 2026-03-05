<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfoGuideTranslation extends Model
{
    protected $fillable = ['locale', 'title', 'content'];

    public function infoGuide(): BelongsTo
    {
        return $this->belongsTo(InfoGuide::class, 'info_guide_id');
    }
}
