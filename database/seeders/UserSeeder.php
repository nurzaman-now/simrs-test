<?php

namespace Database\Seeders;

use App\Enums\EnumRoles;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [];
        foreach (EnumRoles::getLabel() as $key => $item) {
            $data[] = [
                'nama' => $item,
                'email' => strtolower($key) . '@gmail.com',
                'password' => Hash::make('password'),
                'role' => $key
            ];
        }
        User::factory()->createMany($data);
    }
}
