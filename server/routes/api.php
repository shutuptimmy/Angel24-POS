<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(ProductController::class)->group(function () {
    Route::get('/LoadProducts', 'LoadProducts');
    Route::post('/StoreProduct', 'StoreProduct');
    Route::put('/UpdateProduct/{product}', 'UpdateProduct');
    Route::put('/DeleteProduct/{product}', 'DeleteProduct');
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
