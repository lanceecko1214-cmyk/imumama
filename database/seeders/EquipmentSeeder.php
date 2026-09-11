<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $categories = Category::all()->keyBy('code');
        $locations = Location::all();

        $samples = [
            ['name' => 'Desktop Computer - Core i5', 'category' => 'ICT', 'status' => 'operational', 'condition' => 'good', 'cost' => 32000],
            ['name' => 'Laser Printer', 'category' => 'ICT', 'status' => 'under_maintenance', 'condition' => 'fair', 'cost' => 8500],
            ['name' => 'Executive Office Chair', 'category' => 'FUR', 'status' => 'operational', 'condition' => 'new', 'cost' => 4500],
            ['name' => 'Microscope - Binocular', 'category' => 'LAB', 'status' => 'operational', 'condition' => 'good', 'cost' => 15000],
            ['name' => 'Split-type Air Conditioner 2HP', 'category' => 'ACU', 'status' => 'damaged', 'condition' => 'poor', 'cost' => 42000],
            ['name' => 'Ceiling Mounted Projector', 'category' => 'AVE', 'status' => 'operational', 'condition' => 'good', 'cost' => 28000],
            ['name' => 'Portable Generator 5kVA', 'category' => 'FMT', 'status' => 'operational', 'condition' => 'fair', 'cost' => 55000],
        ];

        foreach ($samples as $i => $sample) {
            $category = $categories[$sample['category']];
            $count = Equipment::withTrashed()->where('category_id', $category->id)->count() + 1;

            Equipment::create([
                'property_number' => sprintf('DLSJBC-%s-%06d', $category->code, $count),
                'name' => $sample['name'],
                'brand' => 'Generic',
                'model' => 'MDL-' . (1000 + $i),
                'serial_number' => strtoupper(uniqid('SN')),
                'category_id' => $category->id,
                'location_id' => $locations->random()->id,
                'status' => $sample['status'],
                'condition' => $sample['condition'],
                'acquisition_date' => now()->subMonths(rand(1, 36)),
                'acquisition_cost' => $sample['cost'],
                'supplier' => 'DLSJBC Approved Supplier',
                'warranty_expiry' => now()->addDays(rand(-30, 400)),
                'created_by' => $admin?->id,
            ]);
        }
    }
}
