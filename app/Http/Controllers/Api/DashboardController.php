<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary()
    {
        $totalEquipment = Equipment::count();
        $totalValue = Equipment::sum('acquisition_cost');

        $byStatus = Equipment::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $byCondition = Equipment::select('condition', DB::raw('count(*) as total'))
            ->groupBy('condition')
            ->pluck('total', 'condition');

        $byCategory = Equipment::join('categories', 'categories.id', '=', 'equipment.category_id')
            ->select('categories.name', DB::raw('count(*) as total'))
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $byLocation = Equipment::join('locations', 'locations.id', '=', 'equipment.location_id')
            ->select('locations.building', DB::raw('count(*) as total'))
            ->groupBy('locations.building')
            ->orderByDesc('total')
            ->get();

        $warrantyExpiringSoon = Equipment::with(['category', 'location'])
            ->whereNotNull('warranty_expiry')
            ->whereBetween('warranty_expiry', [now(), now()->addDays(60)])
            ->orderBy('warranty_expiry')
            ->limit(10)
            ->get(['id', 'property_number', 'name', 'warranty_expiry', 'category_id', 'location_id']);

        $recentlyAdded = Equipment::with(['category', 'location'])
            ->latest()
            ->limit(8)
            ->get(['id', 'property_number', 'name', 'status', 'created_at', 'category_id', 'location_id']);

        $needingAttention = Equipment::whereIn('status', ['under_maintenance', 'damaged'])->count();

        return response()->json([
            'total_equipment' => $totalEquipment,
            'total_value' => (float) $totalValue,
            'needing_attention' => $needingAttention,
            'by_status' => $byStatus,
            'by_condition' => $byCondition,
            'by_category' => $byCategory,
            'by_location' => $byLocation,
            'warranty_expiring_soon' => $warrantyExpiringSoon,
            'recently_added' => $recentlyAdded,
        ]);
    }
}
