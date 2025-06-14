<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'max:15'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        // prevent is_deleted users
        if (!$user || $user->is_deleted) {
            return response()->json([
                'message' => 'Invalid credentials or account is deactivated.'
            ], 401);
        }

        if (!Auth::attempt($credentials)) {
            AuditLog::create([
                'user_id' => null,
                'event' => 'login_failed',
                'new_values' => ['email' => $credentials['email']],
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ]);
            return response()->json(['message' => 'Invalid credentials or account is deactivated.'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLog::create([
            'user_id' => $user->user_id,
            'event' => 'login_successful',
            'auditable_type' => User::class,
            'auditable_id' => $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json(['message' => 'Login Authorized', 'token' => $token, 'user' => $user], 200);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logout Success'
            ], 200);
        }

        return response()->json([
            'message' => 'No active user session to logout.'
        ], 401);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
