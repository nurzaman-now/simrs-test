<?php

namespace App\Http\Relations;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait UserRelation
{
    public function menu(): BelongsToMany
    {
        return $this->belongsToMany(
            Menu::class,
            'user_menu_akses',
            'user_id',
            'menu_id'
        )->withPivot('created_at', 'updated_at');
        // ->whereNull('menu.menu_id')
    }
}
