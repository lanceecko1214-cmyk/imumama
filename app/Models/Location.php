<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['building', 'floor', 'room', 'custodian'];

    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function getLabelAttribute(): string
    {
        return trim(collect([$this->building, $this->floor, $this->room])->filter()->implode(' - '));
    }
}
