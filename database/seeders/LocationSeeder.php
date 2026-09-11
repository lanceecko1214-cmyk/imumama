<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['building' => 'Main Academic Building', 'floor' => '1st Floor', 'room' => 'Room 101', 'custodian' => 'College of Arts and Sciences'],
            ['building' => 'Main Academic Building', 'floor' => '2nd Floor', 'room' => 'Room 205', 'custodian' => 'College of Business'],
            ['building' => 'Engineering Building', 'floor' => '1st Floor', 'room' => 'Computer Lab 1', 'custodian' => 'College of Engineering'],
            ['building' => 'Engineering Building', 'floor' => '2nd Floor', 'room' => 'Electronics Lab', 'custodian' => 'College of Engineering'],
            ['building' => 'Library Building', 'floor' => 'Ground Floor', 'room' => 'Reading Area', 'custodian' => 'Library Services'],
            ['building' => 'Administration Building', 'floor' => '1st Floor', 'room' => 'Physical Plant Office', 'custodian' => 'Physical Plant & Equipment Office'],
            ['building' => 'Gymnasium', 'floor' => 'Ground Floor', 'room' => 'Main Hall', 'custodian' => 'Sports Development Office'],
        ];

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['building' => $location['building'], 'floor' => $location['floor'], 'room' => $location['room']],
                $location
            );
        }
    }
}
