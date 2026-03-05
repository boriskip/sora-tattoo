<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkImageTranslation extends Model
{
    protected $fillable = ['locale', 'alt'];

    public function workImage(): BelongsTo
    {
        return $this->belongsTo(WorkImage::class, 'work_image_id');
    }
}
