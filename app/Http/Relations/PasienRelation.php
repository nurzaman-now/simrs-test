<?php

namespace App\Http\Relations;

use App\Models\Menu;
use App\Models\Pemeriksaan;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait PasienRelation
{
    public function pemeriksaan(): HasMany
    {
        return $this->hasMany(Pemeriksaan::class, 'pasien_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
