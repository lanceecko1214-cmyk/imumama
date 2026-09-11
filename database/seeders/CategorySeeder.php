<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'ICT & Computer Equipment', 'code' => 'ICT', 'description' => 'Computers, printers, networking gear'],
            ['name' => 'Furniture & Fixtures', 'code' => 'FUR', 'description' => 'Chairs, tables, cabinets'],
            ['name' => 'Laboratory Equipment', 'code' => 'LAB', 'description' => 'Science and engineering lab apparatus'],
            ['name' => 'Air Conditioning Units', 'code' => 'ACU', 'description' => 'Split-type and window-type air conditioners'],
            ['name' => 'Audio-Visual Equipment', 'code' => 'AVE', 'description' => 'Projectors, sound systems, cameras'],
            ['name' => 'Facilities & Maintenance Tools', 'code' => 'FMT', 'description' => 'Generators, power tools, janitorial equipment'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['code' => $category['code']], $category);
        }
    }
}
