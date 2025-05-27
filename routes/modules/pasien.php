<?php

use App\Enums\EnumRoles;
use App\Http\Controllers\PasienController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:'. EnumRoles::SuperAdmin->value)
    ->prefix('pasien')->name('pasien.')
    ->controller(PasienController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{pasien}', 'update')->name('update');
        Route::delete('/{pasien}', 'destroy')->name('destroy');
    });
