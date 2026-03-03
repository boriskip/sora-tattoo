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
}
