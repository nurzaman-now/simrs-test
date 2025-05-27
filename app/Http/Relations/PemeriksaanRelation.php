<?php

namespace App\Http\Relations;

use App\Models\Menu;
use App\Models\Pasien;
use App\Models\PemberianObat;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait PemeriksaanRelation
{
    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class, 'pasien_id', 'id');
    }

    public function perawat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'perawat_id', 'id');
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dokter_id', 'id');
    }

    public function pemberianObat(): HasMany
    {
        return $this->hasMany(PemberianObat::class, 'pemeriksaan_id', 'id');
    }
}
