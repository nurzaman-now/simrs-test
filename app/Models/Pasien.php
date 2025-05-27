<?php

namespace App\Models;

use App\Http\Relations\PasienRelation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    use HasFactory, PasienRelation;

    protected $table = 'pasien';

    protected $fillable = [
        'nama',
        'tanggal_lahir',
        'jenis_kelamin',
        'nomor_telepon',
        'created_by'
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];
}
