<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'locale',
        'author',
        'email',
        'text',
        'rating',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
