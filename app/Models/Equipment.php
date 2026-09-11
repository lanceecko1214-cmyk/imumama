<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_number',
        'name',
        'brand',
        'model',
        'serial_number',
        'category_id',
        'location_id',
        'status',
        'condition',
        'acquisition_date',
        'acquisition_cost',
        'supplier',
        'warranty_expiry',
        'image_path',
        'remarks',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'warranty_expiry' => 'date',
            'acquisition_cost' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(EquipmentHistory::class)->latest();
    }
}
