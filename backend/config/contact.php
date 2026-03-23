<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Booking / contact form recipient
    |--------------------------------------------------------------------------
    |
    | All inquiries from the public contact form are sent to this address.
    | Override in .env with CONTACT_MAIL_TO if needed.
    |
    */

    'mail_to' => env('CONTACT_MAIL_TO', 'info@soratattoo.de'),

];
