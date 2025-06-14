<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers()
    {
        $users = User::with(['gender'])
            ->with(['role'])
            ->where('tbl_users.is_deleted', false)
            ->get();

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required'],
            'middle_name' => ['nullable'],
            'last_name' => ['required'],
            'suffix_name' => ['nullable'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'],
            'address' => ['required'],
            'contact_number' => ['required'],
            'email' => ['required', 'email', Rule::unique('tbl_users', 'email')],
            'password' => ['required', 'confirmed', 'min:8', 'max:15'],
            'password_confirmation' => ['required', 'min:8', 'max:15'],
            'role' => ['required']
        ]);

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user = User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'age' => $age,
            'birth_date' => $validated['birth_date'],
            'gender_id' => $validated['gender'],
            'address' => $validated['address'],
            'contact_number' => $validated['contact_number'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => $validated['role']
        ]);

        AuditLog::create([
            'user_id' => Auth::id(), // The authenticated user who created the new user
            'event' => 'user_created',
            'auditable_type' => User::class,
            'auditable_id' => $user->user_id,
            'new_values' => $user->withoutRelations()->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json([
            'message' => 'User Successfully Added.'
        ], 200);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required'],
            'middle_name' => ['nullable'],
            'last_name' => ['required'],
            'suffix_name' => ['nullable'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required'],
            'address' => ['required'],
            'contact_number' => ['required'],
            'email' => ['required', 'email', Rule::unique('tbl_users', 'email')->ignore($user)],
            'role' => ['required'],
        ]);

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;
        $oldValues = $user->withoutRelations()->toArray();

        $user->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'age' => $age,
            'birth_date' => $validated['birth_date'],
            'gender_id' => $validated['gender'],
            'address' => $validated['address'],
            'contact_number' => $validated['contact_number'],
            'email' => $validated['email'],
            'role_id' => $validated['role'],
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => 'user_updated',
            'auditable_type' => User::class,
            'auditable_id' => $user->user_id,
            'old_values' => $oldValues,
            'new_values' => $user->withoutRelations()->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json([
            'message' => 'User\'s details successfully Updated.'
        ], 200);
    }

    public function destroyUser(User $user)
    {

        $oldValues = $user->withoutRelations()->toArray();

        $user->update([
            'is_deleted' => true
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => 'user_deactivated',
            'auditable_type' => User::class,
            'auditable_id' => $user->user_id,
            'old_values' => $oldValues,
            'new_values' => $user->withoutRelations()->toArray(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        return response()->json([
            'message' => 'User has been deleted.'
        ], 200);
    }
}
