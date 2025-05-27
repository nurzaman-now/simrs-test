<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\PasienController;
use Illuminate\Support\Facades\Route;

Route::prefix('pasien')->name('pasien.')
    ->controller(PasienController::class)->group(function () {
        Route::get('/', 'index')->name('index');
    });
