<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // No EnsureFrontendRequestsAreStateful: frontend (soratattoo.de) and API (api.soratattoo.de) are cross-origin; we use token auth only, so no session/CSRF on API.
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Add CORS headers to exception responses (e.g. 500) so browser allows frontend to read them
        $exceptions->respond(function ($response, $e, $request) {
            if ($request->is('api/*') && $response instanceof \Symfony\Component\HttpFoundation\Response) {
                $origins = config('cors.allowed_origins', ['http://localhost:3001']);
                $origin = $request->header('Origin');
                if (in_array($origin, $origins, true)) {
                    $response->headers->set('Access-Control-Allow-Origin', $origin);
                }
                $response->headers->set('Access-Control-Allow-Credentials', 'true');
                $response->headers->set('Access-Control-Allow-Methods', implode(', ', config('cors.allowed_methods', ['*'])));
                $response->headers->set('Access-Control-Allow-Headers', implode(', ', (array) config('cors.allowed_headers', ['*'])));
            }
            return $response;
        });
    })->create();

