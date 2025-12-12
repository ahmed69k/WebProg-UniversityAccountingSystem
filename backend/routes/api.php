<?php
use App\Http\Controllers\FeeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Pail\ValueObjects\Origin\Console;

Route::post('/register', [UserController::class, 'store']);
Route::post('/login',[UserController::class, 'login']);
Route::middleware('auth:sanctum')->get('/profile',[UserController::class,'profile']);
Route::post('/logout', [UserController::class,'logout'])->middleware('auth:sanctum');
Route::get('/user/credit',[UserController::class,'getCreditCard'])->middleware('auth:sanctum');
Route::get('/users',[UserController::class, 'getAllUsers'])->middleware('auth:sanctum');
Route::put('/user/{id}', [UserController::class,'update'])->middleware('auth:sanctum');
Route::delete('/users/{id}',[UserController::class, 'deleteUser'])->middleware('auth:sanctum');

Route::post('/fees',[FeeController::class,'store'])->middleware('auth:sanctum');
Route::get('/fees/user',[FeeController::class,'getUserFees'])->middleware('auth:sanctum');
Route::get('/fees',[FeeController::class,'getAllFees'])->middleware('auth:sanctum');
Route::post('/fees/pay',[FeeController::class, 'payFees'])->middleware("auth:sanctum");
Route::delete('/fees/{id}',[FeeController::class, 'delete'])->middleware('auth:sanctum');
Route::get('/fees/{id}',[FeeController::class,'getFeeById'])->middleware('auth:sanctum');
