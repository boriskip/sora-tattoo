<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    protected $table = 'contact_settings';

    protected $fillable = [
        'locale',
        'address',
        'working_hours',
        'phone',
        'email',
    ];
}
