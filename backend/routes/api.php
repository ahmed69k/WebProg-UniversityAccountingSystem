<?php
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\UserController;
use App\Models\Department;
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

Route::post('/departments', [DepartmentController::class,'store'])->middleware('auth:sanctum');
Route::get('/departments',[DepartmentController::class, 'getAll'])->middleware('auth:sanctum');
Route::delete('/departments/{id}',[DepartmentController::class, 'delete'])->middleware('auth:sanctum');
Route::put('/departments/update/{id}',[DepartmentController::class,'update'])->middleware("auth:sanctum");

Route::post('/salary/to-all-staff',[SalaryController::class, 'addSalaryToAllStaff'])->middleware('auth:sanctum');
Route::get('/salary',[SalaryController::class,'getSalaryForEmployee'])->middleware('auth:sanctum');
Route::get('/salary/all',[SalaryController::class,'getAll'])->middleware('auth:sanctum');
Route::put('/salary/bonus-or-deductions/{id}',[SalaryController::class, 'addBonusOrDeductions'])->middleware('auth:sanctum');
