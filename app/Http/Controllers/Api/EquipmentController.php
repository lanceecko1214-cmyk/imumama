<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentResource;
use App\Models\Category;
use App\Models\Equipment;
use App\Models\EquipmentHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::with(['category', 'location']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('property_number', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($condition = $request->query('condition')) {
            $query->where('condition', $condition);
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($locationId = $request->query('location_id')) {
            $query->where('location_id', $locationId);
        }

        $sort = $request->query('sort', '-created_at');
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');
        if (in_array($column, ['name', 'property_number', 'status', 'condition', 'created_at', 'acquisition_cost'])) {
            $query->orderBy($column, $direction);
        }

        $perPage = min((int) $request->query('per_page', 15), 100);

        return EquipmentResource::collection($query->paginate($perPage));
    }

    public function store(StoreEquipmentRequest $request)
    {
        $data = $request->validated();

        $equipment = DB::transaction(function () use ($data, $request) {
            $data['property_number'] = $this->generatePropertyNumber($data['category_id']);
            $data['created_by'] = $request->user()?->id;

            if ($request->hasFile('image')) {
                $data['image_path'] = $request->file('image')->store('equipment', 'public');
            }

            $equipment = Equipment::create($data);

            EquipmentHistory::create([
                'equipment_id' => $equipment->id,
                'user_id' => $request->user()?->id,
                'action' => 'created',
                'notes' => 'Equipment record created and tagged ' . $equipment->property_number,
            ]);

            return $equipment;
        });

        return new EquipmentResource($equipment->load(['category', 'location']));
    }

    public function show(Equipment $equipment)
    {
        return new EquipmentResource($equipment->load(['category', 'location', 'creator', 'histories.user']));
    }

    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $request, $equipment) {
            $trackedFields = ['status', 'condition', 'location_id'];

            foreach ($trackedFields as $field) {
                if (array_key_exists($field, $data) && $data[$field] != $equipment->{$field}) {
                    EquipmentHistory::create([
                        'equipment_id' => $equipment->id,
                        'user_id' => $request->user()?->id,
                        'action' => $field === 'location_id' ? 'transferred' : 'status_changed',
                        'field_changed' => $field,
                        'old_value' => (string) $equipment->{$field},
                        'new_value' => (string) $data[$field],
                    ]);
                }
            }

            if ($request->hasFile('image')) {
                if ($equipment->image_path) {
                    Storage::disk('public')->delete($equipment->image_path);
                }
                $data['image_path'] = $request->file('image')->store('equipment', 'public');
            }

            $equipment->update($data);
        });

        return new EquipmentResource($equipment->load(['category', 'location']));
    }

    public function destroy(Request $request, Equipment $equipment)
    {
        EquipmentHistory::create([
            'equipment_id' => $equipment->id,
            'user_id' => $request->user()?->id,
            'action' => 'disposed',
            'notes' => $request->input('notes', 'Equipment removed from active inventory.'),
        ]);

        $equipment->delete();

        return response()->json(['message' => 'Equipment archived.']);
    }

    private function generatePropertyNumber(int $categoryId): string
    {
        $category = Category::findOrFail($categoryId);
        $count = Equipment::withTrashed()->where('category_id', $categoryId)->count() + 1;

        return sprintf('DLSJBC-%s-%06d', strtoupper($category->code), $count);
    }
}
