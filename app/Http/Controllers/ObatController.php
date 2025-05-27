<?php

namespace App\Http\Controllers;

use App\Enums\EnumJenisKelamin;
use App\Http\Resources\ObatResource;
use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ObatController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->get('search') ?? null;
        $obat = Obat::query()
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->paginate($request->get('per_page') ?? 10, ["*"], 'page', $request->get('page', 1));

        $obatResource = ObatResource::collection($obat);

        return inertia('Obat/Obat', [
            'obat' => fn() => $obatResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|numeric|min:1',
        ]);

        DB::beginTransaction();
        try {
            Obat::query()->create([
                'nama' => $request->get('nama'),
                'deskripsi' => $request->get('deskripsi'),
                'harga' => $request->get('harga'),
                'stok' => $request->get('stok'),
            ]);

            DB::commit();
            return redirect()->route('obat.index')->with('success', 'Obat berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menambahkan obat: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan obat: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obat $obat)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|numeric|min:1',
        ]);

        DB::beginTransaction();
        try {
            $obat->update([
                'nama' => $request->get('nama'),
                'deskripsi' => $request->get('deskripsi'),
                'harga' => $request->get('harga'),
                'stok' => $request->get('stok'),
            ]);

            DB::commit();
            return redirect()->route('obat.index')->with('success', 'Obat berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal memperbarui obat: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui obat: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obat $obat)
    {
        DB::beginTransaction();
        try {
            $obat->delete();
            DB::commit();
            return redirect()->route('obat.index')->with('success', 'Obat berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menghapus obat: ", [
                'error' => $e->getMessage()
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus obat: ' . $e->getMessage()]);
        }
    }
}
