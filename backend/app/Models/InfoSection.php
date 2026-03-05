<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfoSection extends Model
{
    protected $fillable = ['locale', 'title', 'sort_order'];

    protected $casts = ['sort_order' => 'integer'];
}
