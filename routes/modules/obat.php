<?php

use App\Enums\EnumRoles;
use App\Http\Controllers\ObatController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:'. EnumRoles::SuperAdmin->value)
    ->prefix('obat')->name('obat.')
    ->controller(ObatController::class)->group(function () {
        Route::get('/', 'index')->name('index');
    });
