<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StyleImage extends Model
{
    protected $fillable = [
        'style_id',
        'image',
        'sort_order',
    ];

    protected $casts = [
        'style_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function style(): BelongsTo
    {
        return $this->belongsTo(Style::class);
    }
}
