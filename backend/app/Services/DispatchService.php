<?php

namespace App\Services;

use App\Models\Ambulance;
// use App\Models\EmergencyLog;
use App\Models\EmergencyRejection;
use App\Models\EmergencyRequest;
use Illuminate\Support\Facades\DB;

class DispatchService
{
     private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a =
            sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) *
            cos(deg2rad($lat2)) *
            sin($dLon / 2) *
            sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
    public function assignNearestAmbulance(EmergencyRequest $emergency)
    {
    // Ambulances that have already rejected this emergency
    $rejectedIds = EmergencyRejection::where(
        'emergency_request_id',
        $emergency->id
    )->pluck('ambulance_id');

    // Available ambulances
    $ambulances = Ambulance::with('driver')
        ->whereHas('driver')
        ->where('status', 'Available')
        ->whereNotIn('id', $rejectedIds)
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->get();

    if ($ambulances->isEmpty()) {
        return null;
    }

    $nearestAmbulance = null;
    $nearestDistance = PHP_FLOAT_MAX;

    foreach ($ambulances as $ambulance) {

        $distance = $this->calculateDistance(
            $emergency->latitude,
            $emergency->longitude,
            $ambulance->latitude,
            $ambulance->longitude
        );

        if ($distance < $nearestDistance) {
            $nearestDistance = $distance;
            $nearestAmbulance = $ambulance;
        }
    }

    if (!$nearestAmbulance) {
        return null;
    }

    \Log::info([
        'DispatchService Selected' => $nearestAmbulance->vehicle_number,
        'Distance' => $nearestDistance,
    ]);

    // Reserve ambulance
   DB::transaction(function () use ($nearestAmbulance, $emergency) {

    $nearestAmbulance->update([
        'status' => 'Busy'
    ]);

    $emergency->update([
        'ambulance_id' => $nearestAmbulance->id,
        'assigned_at' => now(),
    ]);

    });
    $emergency->refresh();
    return $nearestAmbulance;
    }
}
