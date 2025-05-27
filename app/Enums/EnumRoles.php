<?php

namespace App\Enums;

enum EnumRoles: string
{
    case SuperAdmin = 'super_admin';
    case Pendaftaran = 'pendaftaran';

    case Dokter = 'dokter';

    case Perawat = 'perawat';

    case Apoteker = 'apoteker';

    public static function getLabel(): array
    {
        return [
            self::SuperAdmin->value => 'Super Admin',
            self::Pendaftaran->value => 'Pendaftaran',
            self::Dokter->value => 'Dokter',
            self::Perawat->value => 'Perawat',
            self::Apoteker->value => 'Apoteker',
        ];
    }

    public static function getValues(): array
    {
        return array_map(fn($role) => $role->value, self::cases());
    }
}
