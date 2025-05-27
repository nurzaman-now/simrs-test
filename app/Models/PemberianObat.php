<?php

namespace App\Models;

use App\Http\Relations\PemberianObatRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemberianObat extends Model
{
    use HasFactory, PemberianObatRelation;

    protected $table = 'pemberian_obat';

    protected $fillable = [
        'pemeriksaan_id',
        'obat_id',
        'harga',
        'jumlah',
        'total',
    ];
}
