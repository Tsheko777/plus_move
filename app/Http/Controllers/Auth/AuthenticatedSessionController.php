<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */

    /**
     * Log in a user
     *
     * @group Authentication
     * This endpoint logs in a registered user and redirects to the dashboard.
     *
     * @bodyParam email string required The user's email. Example: user@example.com
     * @bodyParam password string required The user's password. Example: password123
     *
     * @response 302 scenario="Success" Redirects to the dashboard after login.
     * @response 422 scenario="Validation error" {
     *  "message": "The given data was invalid.",
     *  "errors": {
     *    "email": ["These credentials do not match our records."]
     *  }
     * }
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */

    /**
     * Log out the authenticated user
     *
     * @group Authentication
     * This endpoint logs out the currently authenticated user by invalidating their session.
     *
     * @authenticated
     *
     * @response 302 Redirects to the homepage after logout.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
