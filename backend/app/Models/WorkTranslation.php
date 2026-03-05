<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkTranslation extends Model
{
    protected $fillable = ['locale', 'title'];

    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }
}
