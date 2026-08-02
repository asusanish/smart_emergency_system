<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ambulance;

class AmbulanceController extends Controller
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

    public function nearby(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        $ambulances = Ambulance::with('driver')->get();

        // $ambulances = Ambulance::where('status', 'Available')
        //     ->with('driver')
        //     ->get();

        foreach ($ambulances as $ambulance) {

            if (!$ambulance->latitude || !$ambulance->longitude) {
                continue;
            }

            $distance = $this->calculateDistance(
                $request->latitude,
                $request->longitude,
                $ambulance->latitude,
                $ambulance->longitude
            );

            $ambulance->distance = round($distance, 2);

            // ETA assuming 40 km/h average
            $ambulance->eta = ceil(($distance / 40) * 60);
        }

        $ambulances = $ambulances
            ->filter(function ($ambulance) {
                return isset($ambulance->distance)
                    && $ambulance->distance <= 5;
            })
            ->sortBy('distance')
            ->values();

        return response()->json([
            'ambulances' => $ambulances
        ]);
    }
}