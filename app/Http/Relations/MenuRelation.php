<?php

namespace App\Http\Relations;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait MenuRelation
{
    public function subMenu(): HasMany
    {
        return $this->hasMany(Menu::class, 'menu_id', 'id');
    }
}
