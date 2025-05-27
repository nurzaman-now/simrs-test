<?php

use App\Http\Controllers\UserMenuAksesController;
use Illuminate\Support\Facades\Route;

Route::prefix('user-menu-akses')->name('user-menu-akses.')
    ->controller(UserMenuAksesController::class)
    ->group(function () {
        Route::get('/', fn() => '')->name('index');
    });
