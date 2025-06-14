<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(
    function () {
        Route::controller(AuthController::class)->group(function () {
            Route::get('/user', 'user');
            Route::post('/logout', 'logout');
        });

        Route::resource('/product', ProductController::class);

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

        Route::controller(CategoryController::class)->group(function () {
            Route::get('/LoadCategories', 'LoadCategories');
            Route::get('/GetCategory/{categoryId}', 'GetCategory');
        });

        Route::controller(FeedbackController::class)->group(function () {
            Route::get('/LoadFeedbacks', 'LoadFeedbacks');
            Route::get('/GetFeedback/{feedbackId}', 'GetFeedback');
            Route::post('/StoreFeedback', 'StoreFeedback');
        });

        Route::controller(RoleController::class)->group(function () {
            Route::get('/LoadRoles', 'LoadRoles');
            Route::get('/GetRole/{roleId}', 'GetRole');
        });

        Route::controller(UserController::class)->group(function () {
            Route::get('/loadUsers', 'loadUsers');
            Route::post('/storeUser', 'storeUser');
            Route::put('/updateUser/{user}', 'updateUser');
            Route::put('/destroyUser/{user}', 'destroyUser');
        });

        Route::controller(OrderController::class)->group(function () {
            Route::get('/LoadOrders', 'LoadOrders');
            Route::get('/GetOrder/{orderId}', 'GetOrder');
            Route::post('/StoreOrder', 'StoreOrder');
        });
    }
);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
