<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function LoadCategories()
    {
        $categories = Category::all();
        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function GetCategory($categoryId)
    {
        $category = Category::find($categoryId);
        return response()->json([
            'category' => $category
        ], 200);
    }
}
