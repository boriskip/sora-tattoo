<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StyleTranslation extends Model
{
    protected $fillable = [
        'locale',
        'name',
        'description',
    ];

    public function style(): BelongsTo
    {
        return $this->belongsTo(Style::class);
    }
}
