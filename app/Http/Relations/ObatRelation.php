<?php

namespace App\Http\Relations;

use App\Models\Menu;
use App\Models\PemberianObat;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait ObatRelation
{
    public function pemberianObat(): HasMany
    {
        return $this->hasMany(PemberianObat::class, 'obat_id');
    }
}
