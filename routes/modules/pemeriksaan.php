<?php

use App\Enums\EnumRoles;
use App\Http\Controllers\PemeriksaanController;
use Illuminate\Support\Facades\Route;

Route::prefix('pemeriksaan')->name('pemeriksaan.')
    ->controller(PemeriksaanController::class)->group(function () {
        $roleMiddleware = 'role:'. EnumRoles::SuperAdmin->value.','. EnumRoles::Dokter->value.','. EnumRoles::Perawat->value.','. EnumRoles::Pendaftaran->value;
        Route::get('/', 'index')->name('index')->middleware($roleMiddleware);
        Route::get('/history', 'history')->name('history');
        Route::put('/{pemeriksaan}', 'update')->name('update')->middleware($roleMiddleware);
    });
