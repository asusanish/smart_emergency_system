<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Patient\EmergencyController;
use App\Http\Controllers\Patient\AmbulanceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('/register',
[AuthController::class,'register']);


Route::post('/login',
[AuthController::class,'login']);

Route::post('/public-emergency', 
[EmergencyController::class, 'publicEmergency']);


Route::middleware('auth:sanctum')->group(function(){

    Route::post(
        '/emergency',
        [EmergencyController::class,'createEmergency']
    );
    Route::get(
'/emergency/{id}/timeline',
[EmergencyController::class,'timeline']
);

Route::get(
    '/patient/emergency/current',
    [EmergencyController::class,'currentEmergency']
);
Route::get(
    '/ambulances/nearby',
    [AmbulanceController::class, 'nearby']
);  

});

use App\Http\Controllers\Driver\DriverController;


Route::middleware('auth:sanctum')->group(function(){


    Route::get(
        '/driver/emergencies',
        [DriverController::class,'emergencies']
    );


    Route::put(
        '/driver/emergency/{id}/status',
        [DriverController::class,'updateStatus']
    );

    Route::put(
    '/driver/location',
    [DriverController::class,'updateLocation']
);


});


use App\Http\Controllers\Admin\AdminController;


Route::middleware('auth:sanctum')->group(function(){

    Route::get(
        '/admin/dashboard',
        [AdminController::class,'dashboard']
    );

});