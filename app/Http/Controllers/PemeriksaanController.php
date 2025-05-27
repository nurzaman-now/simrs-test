<?php

namespace App\Http\Controllers;

use App\Enums\EnumRoles;
use App\Http\Resources\PasienResource;
use App\Http\Resources\PemeriksaanResource;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class PemeriksaanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');

        $pasien = Pasien::query()
            ->where('nama', 'like', '%' . $search . '%')
            ->whereHas('pemeriksaan')
            ->with('pemeriksaan')
            ->orderBy('nama')
            ->paginate(10)
            ->appends($request->all());

        $pasienResource = PasienResource::collection($pasien);

        return inertia('Pemeriksaan/Pemeriksaan', [
            'pasien' => $pasienResource,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pemeriksaan $pemeriksaan): RedirectResponse
    {
        $request->validate([
            'berat_badan' => 'required|numeric',
            'tekanan_darah' => 'required|string|max:10',
            'keluhan' => 'nullable|string|max:255',
            'diagnosa' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $dokterId = $request->has('keluhan');
            $dataDokterId = ['dokter_id' => auth()->id()];
            $dataPegawaiId = ['pegawai_id' => auth()->id()];
            $pemeriksaan->update([
                'berat_badan' => $request->get('berat_badan'),
                'tekanan_darah' => $request->get('tekanan_darah'),
                'keluhan' => $request->get('keluhan'),
                'diagnosa' => $request->get('diagnosa'),
                ...($dokterId ? $dataDokterId : $dataPegawaiId),
            ]);
            DB::commit();
            return redirect()->back()->with('success', 'Pemeriksaan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui pemeriksaan: ' . $e->getMessage()]);
        }
    }

    public function history(): Response
    {
        $pasien = Pasien::query()
            ->whereHas('pemeriksaan')
            ->whereHas('pemeriksaan.dokter', function ($query) {
                $user = auth()->user();
                if ($user->role === EnumRoles::Dokter->value || $user->role === EnumRoles::Perawat->value) {
                    $query->where('id', auth()->id());
                }
            })
            ->with(['pemeriksaan' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->with(['pemeriksaan.dokter', 'pemeriksaan.perawat', 'pemeriksaan.pemberianObat.obat'])
            ->orderBy('nama')
            ->paginate(10);

        $pasienResource = PasienResource::collection($pasien);

        return inertia('Pemeriksaan/Riwayat', [
            'pasien' => $pasienResource,
        ]);
    }
}
