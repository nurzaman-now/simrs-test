<?php

use App\Enums\EnumRoles;
use App\Http\Controllers\PendaftaranController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:'. EnumRoles::SuperAdmin->value . ',' . EnumRoles::Pendaftaran->value)
    ->prefix('pendaftaran')->name('pendaftaran.')
    ->controller(PendaftaranController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
    });
