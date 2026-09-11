<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@dlsjbc.edu.ph'],
            [
                'name' => 'Physical Plant Administrator',
                'password' => Hash::make('ChangeMe!123'),
                'role' => 'admin',
                'position' => 'Physical Plant Officer',
            ]
        );
    }
}
