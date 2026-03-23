<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public array $payload
    ) {}

    public function envelope(): Envelope
    {
        $name = (string) ($this->payload['name'] ?? '');
        $contact = (string) ($this->payload['contact'] ?? '');
        $subject = config('app.name').': Booking inquiry';
        if ($name !== '') {
            $subject .= ' — '.$name;
        }

        $replyTo = [];
        if ($contact !== '' && filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            $replyTo[] = new Address($contact, $name !== '' ? $name : $contact);
        }

        return new Envelope(
            subject: $subject,
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.booking-inquiry',
        );
    }
}
