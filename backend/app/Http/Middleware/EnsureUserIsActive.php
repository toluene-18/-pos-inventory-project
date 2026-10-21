<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rejects tokens belonging to accounts that are no longer active
 * (pending, rejected or deactivated). Defence in depth: deactivation
 * also revokes tokens, but this covers any token that slips through.
 */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== 'active') {
            $request->user()->currentAccessToken()?->delete();

            return response()->json([
                'message' => 'Your account is not active. Please contact the store owner.',
            ], 403);
        }

        return $next($request);
    }
}
