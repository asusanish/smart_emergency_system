<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Patient\AmbulanceController;
use App\Http\Controllers\Patient\EmergencyController;
use App\Http\Controllers\Driver\DriverController;
use App\Http\Controllers\Admin\AdminController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/public-emergency', [EmergencyController::class, 'publicEmergency']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Current User
    |--------------------------------------------------------------------------
    */

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | User Profile
    |--------------------------------------------------------------------------
    */

    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'changePassword']);

    /*
    |--------------------------------------------------------------------------
    | Patient
    |--------------------------------------------------------------------------
    */

    Route::post('/emergency', [EmergencyController::class, 'createEmergency']);

    Route::get('/patient/history', [EmergencyController::class, 'history']);

    Route::get('/patient/emergency/current', [
        EmergencyController::class,
        'currentEmergency'
    ]);

    Route::post('/patient/emergency/{id}/cancel', [
        EmergencyController::class,
        'cancelEmergency'
    ]);

    Route::get('/emergency/{id}/timeline', [
        EmergencyController::class,
        'timeline'
    ]);

    Route::get('/ambulances/nearby', [
        AmbulanceController::class,
        'nearby'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Driver
    |--------------------------------------------------------------------------
    */

    Route::get('/driver/emergencies', [
        DriverController::class,
        'emergencies'
    ]);

    Route::put('/driver/emergency/{id}/status', [
        DriverController::class,
        'updateStatus'
    ]);

    Route::put('/driver/location', [
        DriverController::class,
        'updateLocation'
    ]);

    Route::get('/driver/history', [
        DriverController::class,
        'history'
    ]);

    Route::get('/driver/profile', [
        DriverController::class,
        'profile'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin')->group(function () {

        Route::get('/dashboard', [
            AdminController::class,
            'dashboard'
        ]);

        Route::get('/ambulances', [
            AdminController::class,
            'ambulances'
        ]);

        Route::get('/drivers', [
            AdminController::class,
            'drivers'
        ]);

        Route::get('/users', [
            AdminController::class,
            'users'
        ]);

        Route::get('/analytics', [
            AdminController::class,
            'analytics'
        ]);

        Route::get('/live-emergencies', [
            AdminController::class,
            'liveEmergencies'
        ]);

        Route::get('/emergency-history', [
            AdminController::class,
            'emergencyHistory'
        ]);
    });

});