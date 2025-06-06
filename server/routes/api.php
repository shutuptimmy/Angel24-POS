<?php

use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(ProductController::class)->group(function () {
    Route::get('/LoadProducts', 'LoadProducts');
    Route::post('/StoreProduct', 'StoreProduct');
    Route::put('/UpdateProduct/{product}', 'UpdateProduct');
    Route::put('/DeleteProduct/{product}', 'DeleteProduct');
});

Route::controller(GenderController::class)->group(function () {
    Route::get('/loadGenders', 'loadGenders');
    Route::get('/getGender/{genderId}', 'getGender');
});

Route::controller(RoleController::class)->group(function () {
    Route::get('/LoadRoles', 'LoadRoles');
    Route::get('/GetRole/{userRoleId}', 'GetRole');
});

Route::controller(UserController::class)->group(function () {
    Route::get('/loadUsers', 'loadUsers');
    Route::post('/storeUser', 'storeUser');
    Route::put('/updateUser/{user}', 'updateUser');
    Route::put('/destroyUser/{user}', 'destroyUser');
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
