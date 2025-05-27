<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\PendaftaranController;
use Illuminate\Support\Facades\Route;

Route::prefix('pendaftaran')->name('pendaftaran.')
    ->controller(PendaftaranController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
    });
