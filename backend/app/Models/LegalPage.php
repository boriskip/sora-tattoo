<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    protected $table = 'legal_pages';

    protected $fillable = [
        'locale',
        'impressum_title',
        'impressum_content',
        'privacy_title',
        'privacy_content',
    ];
}
