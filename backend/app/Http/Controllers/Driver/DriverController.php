<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmergencyRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Ambulance;
use App\Models\EmergencyLog;
use App\Services\DispatchService;
use App\Models\EmergencyRejection;


class DriverController extends Controller
{


    public function emergencies()
    {

        $requests = EmergencyRequest::with([
            'ambulance.driver'
        ])
            ->whereHas('ambulance', function ($query) {

                $query->where('driver_id', Auth::id());
            })
            ->whereIn('status', EmergencyRequest::ACTIVE_STATUSES)
            ->get();

        $requests->transform(function ($emergency) {

            $remainingSeconds = null;

            if ($emergency->assigned_at) {

                $elapsed = now()->diffInSeconds($emergency->assigned_at) >= 30
                    - strtotime($emergency->assigned_at);

                $remainingSeconds = max(
                    30 - $elapsed,
                    0
                );
            }

            $emergency->remaining_seconds = $remainingSeconds;


            return $emergency;
        });

        return response()->json([
            'driver' => Auth::id(),
            'emergencies' => $requests
        ]);
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required'
        ]);


        $emergency = EmergencyRequest::findOrFail($id);
        if ($emergency->status == "Cancelled") {

            return response()->json([
                'message' => 'This emergency has already been cancelled.'
            ], 400);
        }


        /*
        |--------------------------------------------------------------------------
        | DRIVER REJECTED
        |--------------------------------------------------------------------------
        */

        if ($request->status == "Rejected") {
            $currentAmbulance = Ambulance::find($emergency->ambulance_id);

            if (!$currentAmbulance) {
                return response()->json([
                    'message' => 'Current ambulance not found.'
                ], 404);
            }

            // Free rejected ambulance
            $currentAmbulance->update([
                'status' => 'Available'
            ]);

            // Save rejection
            EmergencyRejection::create([
                'emergency_request_id' => $emergency->id,
                'ambulance_id' => $currentAmbulance->id,
            ]);

            // Timeline
            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Driver ' . $currentAmbulance->driver->name . ' rejected the request.'
            ]);

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Searching for another ambulance...'
            ]);

            $dispatchService = new DispatchService();

            $nearestAmbulance = $dispatchService->assignNearestAmbulance($emergency);

            if (!$nearestAmbulance) {

                $emergency->update([
                    'status' => 'Waiting'
                ]);

                EmergencyLog::create([
                    'emergency_request_id' => $emergency->id,
                    'status' => 'All ambulances are currently busy.'
                ]);

                EmergencyLog::create([
                    'emergency_request_id' => $emergency->id,
                    'status' => 'Waiting for the next available ambulance.'
                ]);

                return response()->json([
                    'message' => 'Emergency moved to waiting queue.',
                    'emergency' => $emergency
                ]);
            }

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Assigned to ' . $nearestAmbulance->driver->name .
                    ' (' . $nearestAmbulance->vehicle_number . ')'
            ]);

            return response()->json([
                'message' => 'Emergency reassigned successfully.',
                'emergency' => $emergency->fresh(['ambulance.driver'])
            ]);
        }



        /*
        |--------------------------------------------------------------------------
        | NORMAL STATUS UPDATE
        |--------------------------------------------------------------------------
        */


        $emergency->update([

            'status' => $request->status

        ]);



        EmergencyLog::create([

            'emergency_request_id' => $emergency->id,

            'status' => $request->status

        ]);




        /*
        |--------------------------------------------------------------------------
        | COMPLETED
        |--------------------------------------------------------------------------
        */

        if ($request->status == "Completed") {

            $ambulance = Ambulance::find(
                $emergency->ambulance_id
            );


            if ($ambulance) {

                $ambulance->update([
                    'status' => 'Available'
                ]);


                // Check waiting queue

                $queueService = new \App\Services\WaitingQueueService();


                $queueService->assignWaitingEmergency(
                    $ambulance
                );
            }
        }



        return response()->json([

            'message' => 'Emergency status updated',

            'emergency' => $emergency

        ]);
    }
    public function updateLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $ambulance = Ambulance::where(
            'driver_id',
            Auth::id()
        )->first();

        if (!$ambulance) {
            return response()->json([
                'message' => 'Ambulance not found'
            ], 404);
        }

        $ambulance->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Location updated successfully'
        ]);
    }


    public function history()
    {
        $driver = Auth::user();

        $history = EmergencyRequest::whereHas('ambulance', function ($query) use ($driver) {

            $query->where('driver_id', $driver->id);
        })
            ->with([
                'patient',
                'ambulance'
            ])
            ->whereIn('status', [
                'Completed',
                'Cancelled'
            ])
            ->latest()
            ->get();


        return response()->json([
            "history" => $history
        ]);
    }

    public function profile()
{
    $driver = Auth::user();


    $driverProfile = \App\Models\User::with('ambulance')
        ->find($driver->id);


    return response()->json([
        "profile" => $driverProfile
    ]);
}
}
