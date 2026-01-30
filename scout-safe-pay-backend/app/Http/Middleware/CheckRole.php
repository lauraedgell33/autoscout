<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param string $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        // If user is not authenticated, let the auth:sanctum middleware handle it
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if user has the required role
        if (!$request->user()->hasRole($role)) {
            return response()->json(['message' => 'Forbidden. Insufficient permissions.'], 403);
        }

        return $next($request);
    }
}
