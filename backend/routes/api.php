<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\SaleController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/reset-password-with-code', [AuthController::class, 'resetPasswordWithCode']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::patch('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);

    Route::get('/products', [ProductController::class, 'index']);

    Route::middleware('role:owner,manager')->group(function () {
        Route::get('/staff', [AuthController::class, 'listStaff']);
        Route::post('/products/create', [ProductController::class, 'store']);
        Route::post('/products/upload-image', [ProductController::class, 'uploadImage']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class,'delete']);

        Route::get('/stock-adjustments', [StockAdjustmentController::class, 'index']);
        Route::post('/products/{product}/stock-adjustments',
        [StockAdjustmentController::class, 'store']);

        Route::get('/reports/sales', [SaleController::class, 'report']);
    });

    Route::middleware('role:owner')->group(function () {
        Route::patch('/staff/{user}/approve', [AuthController::class, 'approveStaff']);
        Route::delete('/staff/{user}', [AuthController::class, 'deleteStaff']);
    });

    Route::post('/sales', [SaleController::class, 'store']);
    Route::get('/sales/{sale}', [SaleController::class, 'show']);
    Route::get('/sales', [SaleController::class, 'index']);
});
