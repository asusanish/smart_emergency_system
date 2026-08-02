<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Patient\AmbulanceController;
use App\Http\Controllers\Patient\EmergencyController;
use App\Http\Controllers\Admin\AdminController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post(
    '/register',
    [AuthController::class, 'register']
);


Route::post(
    '/login',
    [AuthController::class, 'login']
);

Route::post(
    '/public-emergency',
    [EmergencyController::class, 'publicEmergency']
);


Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/emergency',
        [EmergencyController::class, 'createEmergency']
    );
    Route::get(
        '/emergency/{id}/timeline',
        [EmergencyController::class, 'timeline']
    );

    Route::get(
        '/patient/emergency/current',
        [EmergencyController::class, 'currentEmergency']

    );

    Route::get(
        '/admin/ambulances',
        [AdminController::class, 'ambulances']
    );

    Route::post(
        '/patient/emergency/{id}/cancel',
        [EmergencyController::class, 'cancelEmergency']
    );
    Route::get(
        '/ambulances/nearby',
        [AmbulanceController::class, 'nearby']
    );

    Route::get(
        '/users',
        [
            AdminController::class,
            'users'
        ]
    );
});

use App\Http\Controllers\Driver\DriverController;


Route::middleware('auth:sanctum')->group(function () {


    Route::get(
        '/driver/emergencies',
        [DriverController::class, 'emergencies']
    );


    Route::put(
        '/driver/emergency/{id}/status',
        [DriverController::class, 'updateStatus']
    );

    Route::put(
        '/driver/location',
        [DriverController::class, 'updateLocation']
    );
});



Route::middleware('auth:sanctum')->group(function () {

    Route::get(
        '/admin/dashboard',
        [AdminController::class, 'dashboard']
    );
});

Route::middleware(['auth:sanctum'])
    ->prefix('admin')
    ->group(function () {


        Route::get(
            '/dashboard',
            [AdminController::class, 'dashboard']
        );


        Route::get(
            '/ambulances',
            [AdminController::class, 'ambulances']
        );


        Route::get(
            '/drivers',
            [AdminController::class, 'drivers']
        );

        Route::get('/users', [AdminController::class, 'users']);

        Route::get('/emergency-history', [AdminController::class, 'emergencyHistory']);

        Route::get(
            '/analytics',
            [AdminController::class, 'analytics']
        );

        Route::get(
            '/live-emergencies',
            [AdminController::class, 'liveEmergencies']
        );
    });
