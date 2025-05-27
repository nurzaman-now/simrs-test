<?php

namespace App\Http\Controllers;

use App\Enums\EnumJenisKelamin;
use App\Models\Pasien;
use App\Models\Pemeriksaan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PendaftaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pasien = Pasien::query()
            ->where('nama', 'like', '%' . $request->get('pasien', '') . '%')
            ->orderBy('nama')
            ->limit(10)
            ->get();

        return inertia('Pendaftaran/Pendaftaran', [
            'pasien' => $pasien,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id' => 'nullable|exists:pasien,id',
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:' . implode(',', EnumJenisKelamin::getValues()),
            'nomor_telepon' => 'required|string|max:15',
        ]);

        try {
            DB::beginTransaction();
            $data = [
                'nama' => $request->get('nama'),
                'tanggal_lahir' => $request->get('tanggal_lahir'),
                'jenis_kelamin' => $request->get('jenis_kelamin'),
                'nomor_telepon' => $request->get('nomor_telepon'),
                'created_by' => auth()->id(),
            ];
            if (!$request->has('id') || !$request->get('id')) {
                $pasien = Pasien::query()->create($data);
                $request->merge(['id' => $pasien->getAttribute('id')]);
            } else {
                $pasien = Pasien::query()->findOrFail($request->get('id'));
                $pasien->update($data);
            }
            Pemeriksaan::query()->create([
                'pasien_id' => $request->get('id')
            ]);

            DB::commit();
            return redirect()->route('pendaftaran.index')->with('success', 'Pendaftaran berhasil dilakukan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("PendaftaranController@store: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Pendaftaran gagal: ' . $e->getMessage()]);
        }
    }

}
