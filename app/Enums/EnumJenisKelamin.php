<?php

namespace App\Enums;

enum EnumJenisKelamin: string
{
    case LakiLaki = 'Laki-Laki';
    case Perempuan = 'Perempuan';

    public static function getValues(): array
    {
        return array_column(EnumJenisKelamin::cases(), 'value');
    }
}
