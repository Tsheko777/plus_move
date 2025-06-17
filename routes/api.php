<?php

use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\DeliveriesController;
use App\Http\Controllers\api\PackagesController;
use App\Http\Controllers\api\ReportsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;

//Auth
/* Route::post('login', [AuthController::class, 'login'])->name('apiLogin');
Route::post('register', [AuthController::class, 'register']); */

Route::prefix("api")->middleware(['admin', 'auth'])->group(function () {
    //dashboard
    Route::get('dashboard', [DashboardController::class, 'Dashboard']);

    //reports
    Route::get('reports', [ReportsController::class, 'Reports']);
    Route::post('reports/create', [ReportsController::class, 'createReport']);

    //deliveries
    Route::get('deliveries', [DeliveriesController::class, 'Deliveries']);
    Route::post('deliveries/update', [DeliveriesController::class, 'updateStatus']);
    Route::post('deliveries/package/get', [DeliveriesController::class, 'packageInfomation']);

    //packages
    Route::get('packages', [PackagesController::class, 'Packages']);
    Route::post('packages/create', [PackagesController::class, 'createPackage']);
    Route::post('packages/delete', [PackagesController::class, 'deletePackage']);
    Route::post('packages/delivery/get', [PackagesController::class, 'deliveryInfomation']);
});




