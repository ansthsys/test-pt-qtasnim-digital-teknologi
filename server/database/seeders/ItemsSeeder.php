<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Kopi',
                'stock' => 100,
                'item_type_id' => 1,
            ],
            [
                'name' => 'Teh',
                'stock' => 100,
                'item_type_id' => 1,
            ],
            [
                'name' => 'Pasta Gigi',
                'stock' => 100,
                'item_type_id' => 2,
            ],
            [
                'name' => 'Sabun Mandi',
                'stock' => 100,
                'item_type_id' => 2,
            ],
            [
                'name' => 'Sampo',
                'stock' => 100,
                'item_type_id' => 2,
            ],
        ];

        DB::table('items')->insert($data);
    }
}
