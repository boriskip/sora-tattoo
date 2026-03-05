<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    protected $fillable = [
        'locale',
        'title',
        'content',
        'images',
        'sort_order',
    ];

    protected $casts = [
        'images' => 'array',
        'sort_order' => 'integer',
    ];
}
