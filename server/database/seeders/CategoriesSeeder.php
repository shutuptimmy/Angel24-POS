<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tbl_categories')->insert([
            ['category' => 'Foods'],
            ['category' => 'Snacks'],
            ['category' => 'Beverages'],
            ['category' => 'Personal Care'],
            ['category' => 'Household Supplies'],
        ]);
    }
}
