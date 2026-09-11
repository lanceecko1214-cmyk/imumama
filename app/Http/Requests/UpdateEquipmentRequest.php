<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'location_id' => ['sometimes', 'required', 'exists:locations,id'],
            'status' => ['sometimes', 'required', 'in:operational,under_maintenance,damaged,decommissioned'],
            'condition' => ['sometimes', 'required', 'in:new,good,fair,poor'],
            'acquisition_date' => ['nullable', 'date'],
            'acquisition_cost' => ['nullable', 'numeric', 'min:0'],
            'supplier' => ['nullable', 'string', 'max:150'],
            'warranty_expiry' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
