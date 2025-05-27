<?php

namespace App\Models;

use App\Http\Relations\ObatRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory, ObatRelation;

    protected $table = 'obat';

    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'stok',
    ];
}
