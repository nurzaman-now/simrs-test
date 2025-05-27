<?php

namespace App\Http\Controllers;

use App\Enums\EnumRoles;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class PenggunaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->get('search') ?? null;
        $user = User::query()
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->paginate($request->get('per_page') ?? 10, ["*"], 'page', $request->get('page', 1));
        $role = collect(EnumRoles::getLabel())->map(function ($item, $key) {
            return [
                'label' => $item,
                'value' => $key,
            ];
        })->where('value', '!=', EnumRoles::SuperAdmin->value)->values();

        $userResource = UserResource::collection($user);

        return inertia('Pengguna/Pengguna', [
            'pengguna' => fn() => $userResource,
            'role' => $role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        DB::beginTransaction();
        try {
            User::query()->create([
                'nama' => $request->get('nama'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
                'verified' => true,
            ]);

            DB::commit();
            return redirect()->route('pengguna.index')->with('success', 'User berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menambahkan user: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan user: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ]);

        DB::beginTransaction();
        try {
            $user->update([
                'nama' => $request->get('nama'),
                'email' => $request->get('email'),
            ]);

            DB::commit();
            return redirect()->route('pengguna.index')->with('success', 'User berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal memperbarui user: ", [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui user: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        DB::beginTransaction();
        try {
            $user->delete();
            DB::commit();
            return redirect()->route('pengguna.index')->with('success', 'User berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal menghapus user: ", [
                'error' => $e->getMessage()
            ]);
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus user: ' . $e->getMessage()]);
        }
    }
}
