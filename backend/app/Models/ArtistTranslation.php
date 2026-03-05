<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtistTranslation extends Model
{
    protected $fillable = ['locale', 'name', 'style', 'description'];

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class);
    }
}
