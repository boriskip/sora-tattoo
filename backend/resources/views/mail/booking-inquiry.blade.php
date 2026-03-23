<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Booking inquiry</title>
</head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #333;">
    <h1 style="font-size: 1.125rem; margin-bottom: 1rem;">New booking inquiry (website)</h1>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td style="font-weight: 600;">Name</td><td>{{ e($payload['name'] ?? '') }}</td></tr>
        <tr><td style="font-weight: 600;">Contact</td><td>{{ e($payload['contact'] ?? '') }}</td></tr>
        @if(!empty($payload['body_part']))
        <tr><td style="font-weight: 600;">Body part</td><td>{{ e($payload['body_part']) }}</td></tr>
        @endif
        @if(!empty($payload['style']))
        <tr><td style="font-weight: 600;">Style</td><td>{{ e($payload['style']) }}</td></tr>
        @endif
        @if(!empty($payload['artist']))
        <tr><td style="font-weight: 600;">Artist</td><td>{{ e($payload['artist']) }}</td></tr>
        @endif
        @if(!empty($payload['preferred_date']))
        <tr><td style="font-weight: 600;">Preferred date</td><td>{{ e($payload['preferred_date']) }}</td></tr>
        @endif
        @if(!empty($payload['locale']))
        <tr><td style="font-weight: 600;">Site language</td><td>{{ e($payload['locale']) }}</td></tr>
        @endif
    </table>
    @if(!empty($payload['message']))
    <p style="margin-top: 1.25rem; font-weight: 600;">Message</p>
    <p style="white-space: pre-wrap; margin-top: 0;">{{ e($payload['message']) }}</p>
    @endif
</body>
</html>
