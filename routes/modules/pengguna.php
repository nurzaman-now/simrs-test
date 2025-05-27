<?php

use App\Enums\EnumRoles;
use App\Http\Controllers\PenggunaController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:' . EnumRoles::SuperAdmin->value)
    ->prefix('pengguna')->name('pengguna.')
    ->controller(PenggunaController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{user}', 'update')->name('update');
        Route::delete('/{user}', 'destroy')->name('destroy');
    });
