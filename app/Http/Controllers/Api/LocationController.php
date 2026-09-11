<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return Location::withCount('equipment')->orderBy('building')->orderBy('floor')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'building' => ['required', 'string', 'max:100'],
            'floor' => ['nullable', 'string', 'max:50'],
            'room' => ['nullable', 'string', 'max:50'],
            'custodian' => ['nullable', 'string', 'max:150'],
        ]);

        return response()->json(Location::create($data), 201);
    }

    public function update(Request $request, Location $location)
    {
        $data = $request->validate([
            'building' => ['sometimes', 'required', 'string', 'max:100'],
            'floor' => ['nullable', 'string', 'max:50'],
            'room' => ['nullable', 'string', 'max:50'],
            'custodian' => ['nullable', 'string', 'max:150'],
        ]);

        $location->update($data);

        return response()->json($location);
    }

    public function destroy(Location $location)
    {
        if ($location->equipment()->exists()) {
            return response()->json(['message' => 'Cannot delete a location that still has equipment assigned.'], 422);
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted.']);
    }
}
