<?php

namespace App\Services;

use App\Models\Ambulance;
use App\Models\EmergencyLog;
use App\Models\EmergencyRejection;

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
    public function assignNearestAmbulance($emergency)
    {
        // STEP 1: Get rejected ambulances
        $rejectedIds = EmergencyRejection::where(
            'emergency_request_id',
            $emergency->id
        )->pluck('ambulance_id');

        // STEP 2: Find available ambulances
        $ambulances = Ambulance::where('status', 'Available')
            ->whereNotIn('id', $rejectedIds)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with('driver')
            ->get();

        // STEP 3: No ambulance available
        if ($ambulances->isEmpty()) {
            return null;
        }

        //step 4
        $ambulancesWithDistance = [];

foreach ($ambulances as $ambulance) {

    $distance = $this->calculateDistance(

        $emergency->latitude,
        $emergency->longitude,

        $ambulance->latitude,
        $ambulance->longitude

    );

    $ambulancesWithDistance[] = [

        'ambulance' => $ambulance,

        'distance' => $distance

    ];

}

$nearest = collect($ambulancesWithDistance)
    ->sortBy('distance')
    ->first();

if (!$nearest) {
    return null;
}

$nearestAmbulance = $nearest['ambulance'];

$nearestAmbulance = $nearest['ambulance'];

\Log::info([
    'DispatchService Selected' => $nearestAmbulance->vehicle_number,
    'Distance' => $nearest['distance'],
]);

$nearestAmbulance->update([

    'status' => 'Busy'

]);

$emergency->update([

    'ambulance_id' => $nearestAmbulance->id,

    // 'status' => 'Pending',

    'assigned_at'=>now()

]);

return $nearestAmbulance;
    }
}
