<?php

use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;

Route::prefix('menu')->name('menu.')
    ->controller(MenuController::class)->group(function () {
        Route::get('/', 'index')->name('index');
    });
