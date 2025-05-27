<?php

namespace App\Http\Relations;

use App\Models\Obat;
use App\Models\Pemeriksaan;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait PemberianObatRelation
{
    public function pemeriksaan(): BelongsTo
    {
        return $this->belongsTo(Pemeriksaan::class, 'pemeriksaan_id', 'id');
    }

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class, 'obat_id', 'id');
    }
}
