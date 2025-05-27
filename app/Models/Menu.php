<?php

namespace App\Models;

use App\Http\Relations\MenuRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory, MenuRelation;

    protected $table = 'menu';

    protected $fillable = [
        'menu_id',
        'nama',
        'icon',
        'route',
        'order',
    ];
}
