<?php

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\OwnerController;
use Illuminate\Support\Facades\Route;

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::get('/owners', [OwnerController::class, 'index']);
Route::get('/owners/{id}', [OwnerController::class, 'show']);

Route::middleware(['jwt'])->group(function () {

    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);


    Route::post('/owners', [OwnerController::class, 'store']);
    Route::put('/owners/{id}', [OwnerController::class, 'update']);
    Route::delete('/owners/{id}', [OwnerController::class, 'destroy']);
});
