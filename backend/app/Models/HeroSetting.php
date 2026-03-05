<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $table = 'hero_settings';

    protected $fillable = [
        'locale',
        'background_image',
        'social_icons_theme',
        'title_main',
        'title_sub',
        'subtitle',
        'description',
        'facebook_url',
        'instagram_url',
        'whatsapp_url',
        'block1_color',
        'block2_color',
    ];
}
