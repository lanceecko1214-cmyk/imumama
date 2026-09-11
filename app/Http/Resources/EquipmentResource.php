<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_number' => $this->property_number,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'serial_number' => $this->serial_number,
            'status' => $this->status,
            'condition' => $this->condition,
            'acquisition_date' => $this->acquisition_date?->toDateString(),
            'acquisition_cost' => $this->acquisition_cost,
            'supplier' => $this->supplier,
            'warranty_expiry' => $this->warranty_expiry?->toDateString(),
            'image_path' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'remarks' => $this->remarks,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'code' => $this->category->code,
            ],
            'location' => [
                'id' => $this->location->id,
                'label' => $this->location->label,
            ],
            'creator' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'histories' => $this->whenLoaded('histories', function () {
                return $this->histories->map(fn ($h) => [
                    'id' => $h->id,
                    'action' => $h->action,
                    'field_changed' => $h->field_changed,
                    'old_value' => $h->old_value,
                    'new_value' => $h->new_value,
                    'notes' => $h->notes,
                    'user' => $h->user?->name,
                    'created_at' => $h->created_at->toDateTimeString(),
                ]);
            }),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
