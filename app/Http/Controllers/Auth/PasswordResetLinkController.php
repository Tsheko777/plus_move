<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

    /**
     * Request a password reset link
     *
     * @group Password Reset
     * This endpoint sends a password reset link to the provided email address.
     * If the email exists in the system, a reset link will be sent.
     *
     * @bodyParam email string required The email address of the user. Example: user@example.com
     *
     * @response 302 scenario="Success" {
     *  "status": "A reset link will be sent if the account exists."
     * }
     * @response 422 scenario="Validation error" {
     *  "message": "The given data was invalid.",
     *  "errors": {
     *    "email": ["The email field is required."]
     *  }
     * }
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        Password::sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
