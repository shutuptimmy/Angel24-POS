<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function LoadRoles()
    {
        $roles = Role::all();
        return response()->json([
            'roles' => $roles
        ], 200);
    }

    public function GetRole($roleId)
    {
        $role = Role::find($roleId);
        return response()->json([
            'role' => $role
        ], 200);
    }
}
