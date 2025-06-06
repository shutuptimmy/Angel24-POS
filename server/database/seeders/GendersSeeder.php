<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GendersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tbl_genders')->insert([
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Intersex'],
        ]);
    }
}
