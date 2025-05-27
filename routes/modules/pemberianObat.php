<?php

use App\Http\Controllers\PemberianObatController;
use Illuminate\Support\Facades\Route;

Route::prefix('pemberian-obat')->name('pemberian-obat.')
    ->controller(PemberianObatController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store-many', 'storeMany')->name('store.many');
        Route::delete('/destroy/{pemberianObat}', 'destroy')->name('destroy');
    });
