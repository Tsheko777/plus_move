<?php

use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\DeliveriesController;
use App\Http\Controllers\api\DriversController;
use App\Http\Controllers\api\PackagesController;
use App\Http\Controllers\api\ReportsController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::user()) {
        return redirect("/dashboard");
    }
    return Inertia::render('auth/login');
})->name('home');

Route::get('/email', function () {
    return view('email.status', [
        'email' => 'uxpress01@gmail.com',
        'status' => 'created',
        'address' => '1535 Block M Haniview Maubane 0412',
        'delivery_date' => '12 April 2025 10:23:18',
        'updated_at' => '12 June 2025 10:23:18',
        'driver_name' => "Andre Coleman"
    ]);
})->name('email');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        $dashboard = new DashboardController();
        return Inertia::render('dashboard', ['dashboard' => $dashboard->Dashboard()]);
    })->name('dashboard');

    Route::get('reports', function () {
        $reports = new ReportsController();
        return Inertia::render('reports', ['reports' => $reports->Reports()]);
    })->name('reports');

    Route::get('deliveries', function () {
        $deliveries = new DeliveriesController();
        return Inertia::render('deliveries', ['deliveries' => $deliveries->Deliveries()]);
    })->name('deliveries');

    Route::get('deliveries/status/{status}', function ($status) {
        $deliveries = new DeliveriesController();
        return Inertia::render('deliveries', ['deliveries' => $deliveries->Deliveries($status)]);
    })->name('deliveries');

    Route::get('packages', function () {
        $packages = new PackagesController();
        return Inertia::render('packages', ['packages' => $packages->Packages()]);
    })->name('packages');

    Route::get('packages/status/{status}', function ($status) {
        $packages = new PackagesController();
        return Inertia::render('packages', ['packages' => $packages->Packages($status)]);
    })->name('packages/status');

    Route::get('drivers', function (Request $request) {
        $drivers = new DriversController();
        $driverResults = $drivers->Drivers();
        return Inertia::render('drivers', ['drivers' => $driverResults['drivers'], 'summary' => $driverResults['summary']]);
    })->name('drivers');

    Route::get('drivers/{email}', function ($email) {
        $drivers = new DriversController();
        $driverResults = $drivers->SeachDriver($email);
        return Inertia::render('drivers', ['drivers' => $driverResults['drivers'], 'summary' => $driverResults['summary']]);
    })->name('drivers');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
