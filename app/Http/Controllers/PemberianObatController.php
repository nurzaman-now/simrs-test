<?php

namespace App\Http\Controllers;

use App\Http\Resources\PemeriksaanResource;
use App\Models\Obat;
use App\Models\PemberianObat;
use App\Models\Pemeriksaan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class PemberianObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search') ?? null;
        $searchObat = $request->get('search_obat') ?? null;
        $pemeriksaan = Pemeriksaan::query()
            ->when($search, function ($query, $search) {
                $query->whereHas('pasien', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%");
                });
            })
            ->whereNotNull('dokter_id')
            ->with(['pasien', 'pemberianObat', 'pemberianObat.obat'])
            ->paginate($request->get('per_page') ?? 10, ["*"], 'page', $request->get('page', 1));

        $pemeriksaanResource = PemeriksaanResource::collection($pemeriksaan);
        $obat = Obat::query()
            ->when($searchObat, function ($query, $searchObat) {
                $query->where('nama', 'like', "%{$searchObat}%");
            })
            ->limit(10)->get();

        return inertia('PemberianObat/PemberianObat', [
            'pemeriksaan' => fn() => $pemeriksaanResource,
            'obat' => $obat,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeMany(Request $request): void
    {
        $request->validate([
            'pemberian_obat' => 'required|array',
            'pemberian_obat.*.id' => 'nullable|exists:pemberian_obat,id',
            'pemberian_obat.*.pemeriksaan_id' => 'required|exists:pemeriksaan,id',
            'pemberian_obat.*.obat_id' => 'required|exists:obat,id',
            'pemberian_obat.*.jumlah' => 'required|integer|min:1',
            'pemberian_obat.*.total' => 'required|numeric|min:0',
        ]);
        $pemberianObatData = $request->get('pemberian_obat');

        DB::beginTransaction();
        try {
            $obatIds = collect($pemberianObatData)->pluck('obat_id')->unique()->values();
            $obat = Obat::query()
                ->whereIn('id', $obatIds)
                ->get();
            foreach ($pemberianObatData as $data) {
                $created = [
                    'pemeriksaan_id' => $data['pemeriksaan_id'],
                    'obat_id' => $data['obat_id'],
                    'harga' => $obat->firstWhere('id', $data['obat_id'])->harga ?? 0,
                    'jumlah' => $data['jumlah'],
                    'total' => $data['total'],
                ];
                PemberianObat::query()->updateOrCreate(
                    [
                        'id' => $data['id'] ?? null,
                    ],
                    $created
                );
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("PemberianObatController@storeMany: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PemberianObat $pemberianObat): void
    {
        try {
            DB::beginTransaction();
            $pemberianObat->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("PemberianObatController@destroy: ", [
                'error' => $e->getMessage(),
                'pemberian_obat_id' => $pemberianObat->id,
            ]);
        }
    }

}
