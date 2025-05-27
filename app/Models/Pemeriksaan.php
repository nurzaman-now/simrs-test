<?php

namespace App\Models;

use App\Http\Relations\PemeriksaanRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeriksaan extends Model
{
    use HasFactory, PemeriksaanRelation;

    protected $table = 'pemeriksaan';

    protected $fillable = [
        'pasien_id',
        'perawat_id',
        'dokter_id',
        'berat_badan',
        'tekanan_darah',
        'keluhan',
        'diagnosa',
    ];
}
