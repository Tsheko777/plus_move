<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @bodyParam name string required The user's full name. Example: John Doe
     * @bodyParam email string required The user's email. Must be unique. Example: john@example.com
     * @bodyParam password string required The user's password (min: 6). Example: secret123
     * @bodyParam password_confirmation string required Confirmation of the password. Must match password. Example: secret123
     *
     * @response 201 {
     *   "message": "User registered",
     *   "access_token": "token_value",
     *   "token_type": "Bearer",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com"
     *   }
     * }
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create token for user
        $token = $user->createToken('auth_token')->plainTextToken;
        event(new Registered($user));

        Auth::login($user);

        return response()->json([
            'message' => 'User registered',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    /**
     * Login an existing user
     *
     * @bodyParam email string required The user's email. Example: john@example.com
     * @bodyParam password string required The user's password. Example: secret123
     *
     * @response 200 {
     *   "message": "Login successful",
     *   "access_token": "token_value",
     *   "token_type": "Bearer",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com"
     *   }
     * }
     * @response 422 {
     *   "message": "The given data was invalid.",
     *   "errors": {
     *     "email": ["The provided credentials are incorrect."]
     *   }
     * }
     */
    public function login(LoginRequest $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $request->authenticate();
        $request->session()->regenerate();

        // Create new token
        $token = $request->user()->createToken('auth')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $request->user(),
        ]);
    }

    /**
     * Logout the authenticated user
     *
     * Requires a valid bearer token. This will revoke the current access token.
     *
     * @response 200 {
     *   "message": "Logged out"
     * }
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out',
        ]);
    }

    /**
     * Get the authenticated user
     *
     * Requires a valid bearer token. Returns the currently authenticated user's data.
     *
     * @response 200 {
     *   "id": 1,
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "email_verified_at": null,
     *   "created_at": "2024-01-01T00:00:00.000000Z",
     *   "updated_at": "2024-01-01T00:00:00.000000Z"
     * }
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
