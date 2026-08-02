<?php

namespace App\Services;

use App\Models\EmergencyRequest;
use App\Models\EmergencyLog;
// use App\Models\Ambulance;

use Illuminate\Support\Facades\Log;

class WaitingQueueService
{

    public function assignWaitingEmergency($ambulance)
    {

        $emergency = EmergencyRequest::where(
            'status',
            'Waiting'
        )
            ->orderBy('created_at', 'asc')
            ->first();



        if (!$emergency) {

            return null;
        }



        // Assign ambulance

        $ambulance->update([
            'status' => 'Busy'
        ]);



        $emergency->update([

            'ambulance_id' => $ambulance->id,

            'status' => 'Pending',

            'assigned_at' => now()

        ]);



        EmergencyLog::create([

            'emergency_request_id' => $emergency->id,

            'status' => 'Assigned to ' . $ambulance->driver->name .
                ' (' . $ambulance->vehicle_number . ')'

        ]);



        Log::info([
            'Waiting emergency assigned' => $emergency->id,
            'Ambulance' => $ambulance->vehicle_number
        ]);

        return $emergency;
    }
}
