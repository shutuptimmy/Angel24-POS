<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    public function loadGenders()
    {
        $genders = Gender::all();
        return response()->json([
            'genders' => $genders
        ], 200);
    }

    public function getGender($genderId)
    {
        $gender = Gender::find($genderId);
        return response()->json([
            'gender' => $gender
        ], 200);
    }
}
