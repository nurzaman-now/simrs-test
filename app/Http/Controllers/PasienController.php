<?php

namespace App\Http\Controllers;

use App\Enums\EnumJenisKelamin;
use App\Http\Resources\PasienResource;
use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PasienController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->get('search') ?? null;
        $pasien = Pasien::query()
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->paginate($request->get('per_page') ?? 10, ["*"], 'page', $request->get('page', 1));

        $pasienResource = PasienResource::collection($pasien);

        return inertia('Pasien/Pasien', [
            'pasien' => fn() => $pasienResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:'. implode(',', EnumJenisKelamin::getValues()),
            'alamat' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            Pasien::query()->create([
                'nama' => $request->get('nama'),
                'tanggal_lahir' => $request->get('tanggal_lahir'),
                'jenis_kelamin' => $request->get('jenis_kelamin'),
                'alamat' => $request->get('alamat'),
                'nomor_telepon' => $request->get('nomor_telepon'),
                'created_by' => auth()->id(),
            ]);

            DB::commit();
            return redirect()->route('pasien.index')->with('success', 'Pasien berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menambahkan pasien: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan pasien: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pasien $pasien)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:'. implode(',', EnumJenisKelamin::getValues()),
            'alamat' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            $pasien->update([
                'nama' => $request->get('nama'),
                'tanggal_lahir' => $request->get('tanggal_lahir'),
                'jenis_kelamin' => $request->get('jenis_kelamin'),
                'alamat' => $request->get('alamat'),
                'nomor_telepon' => $request->get('nomor_telepon'),
            ]);

            DB::commit();
            return redirect()->route('pasien.index')->with('success', 'Pasien berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal memperbarui pasien: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui pasien: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pasien $pasien)
    {
        DB::beginTransaction();
        try {
            $pasien->delete();
            DB::commit();
            return redirect()->route('pasien.index')->with('success', 'Pasien berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menghapus pasien: ", [
                'error' => $e->getMessage()
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus pasien: ' . $e->getMessage()]);
        }
    }
}
