<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function __invoke(Request $request): Response
    {
        $pasien = Pasien::query();
        $countPasien = $pasien->count();
        $countPasienToday = $pasien
            ->whereDate('created_at', now()->toDateString())
            ->count();

        $countPemeriksaan = $pasien->withCount('pemeriksaan')->get()->sum('pemeriksaan_count');
        $countPemeriksaanToday = $pasien->withCount(['pemeriksaan' => function ($query) {
            $query->whereDate('created_at', now()->toDateString());
        }])->get()->sum('pemeriksaan_count');

        $obat = Obat::query();
        $countObat = $obat->count();
        $countObatToday = $obat
            ->whereDate('created_at', now()->toDateString())
            ->count();

        $countPemberianObat = $obat->withCount('pemberianObat')->get()->sum('pemberian_obat_count');
        $countPemberianObatToday = $obat->withCount(['pemberianObat' => function ($query) {
            $query->whereDate('created_at', now()->toDateString());
        }])->get()->sum('pemberian_obat_count');

        // buat jumlah pasien tiap bulan
        $year = $request->get('year', now()->year);
        $pasienPerMonth = [];
        $pemeriksaanPerMonth = [];
        foreach (range(1, 12) as $month) {
            $pasienPerMonth[] = (clone $pasien)->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count();
            $pemeriksaanPerMonth[] = (clone $pasien)->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->withCount('pemeriksaan')
                ->get()
                ->sum('pemeriksaan_count');
        }

        $obat = $obat->withCount('pemberianObat')
            ->orderBy('pemberian_obat_count', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard',
            compact('countPasien',
                'countPasienToday',
                'countPemeriksaan',
                'countPemeriksaanToday',
                'countObat',
                'countObatToday',
                'countPemberianObat',
                'countPemberianObatToday',
                'pasienPerMonth',
                'pemeriksaanPerMonth',
                'obat',
            ));
    }
}
