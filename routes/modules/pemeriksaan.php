<?php

use App\Http\Controllers\PemeriksaanController;
use Illuminate\Support\Facades\Route;

Route::prefix('pemeriksaan')->name('pemeriksaan.')
    ->controller(PemeriksaanController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/history', 'history')->name('history');
        Route::put('/{pemeriksaan}', 'update')->name('update');
    });
