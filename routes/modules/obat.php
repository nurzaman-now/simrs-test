<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\ObatController;
use Illuminate\Support\Facades\Route;

Route::prefix('obat')->name('obat.')
    ->controller(ObatController::class)->group(function () {
        Route::get('/', 'index')->name('index');
    });
