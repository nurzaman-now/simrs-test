<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMenuAkses extends Model
{
    use HasFactory;

    protected $table = 'user_menu_akses';

    protected $fillable = [
        'user_id',
        'menu_id',
    ];
}
