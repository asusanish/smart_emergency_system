<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EmergencyRequest;
use App\Models\EmergencyRejection;
use App\Models\EmergencyLog;
use App\Models\Ambulance;
use App\Services\DispatchService;
use Carbon\Carbon;

class CheckEmergencyTimeouts extends Command
{
    protected $signature = 'emergency:timeouts';

    protected $description = 'Automatically reassign emergencies when drivers do not respond';

    public function handle()
    {
        $dispatchService = new DispatchService();

        $emergencies = EmergencyRequest::with('ambulance.driver')
            ->where('status', 'Pending')
            ->whereNotNull('assigned_at')
            ->get();

        foreach ($emergencies as $emergency) {

            if (
                Carbon::parse($emergency->assigned_at)
                    ->diffInSeconds(now()) < 30
            ) {
                continue;
            }

            $currentAmbulance = $emergency->ambulance;

            if (!$currentAmbulance) {
                continue;
            }

            // Free ambulance
            $currentAmbulance->update([
                'status' => 'Available'
            ]);

            // Save rejection
            EmergencyRejection::create([
                'emergency_request_id' => $emergency->id,
                'ambulance_id' => $currentAmbulance->id,
            ]);

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Driver '.$currentAmbulance->driver->name.' did not respond within 30 seconds.'
            ]);

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Searching for another ambulance...'
            ]);

            $nextAmbulance = $dispatchService->assignNearestAmbulance($emergency);

            if (!$nextAmbulance) {

                $emergency->update([
                    'status' => 'No Ambulance Available'
                ]);

                EmergencyLog::create([
                    'emergency_request_id' => $emergency->id,
                    'status' => 'No ambulance available.'
                ]);

                continue;
            }

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Assigned to '.$nextAmbulance->driver->name.
                    ' ('.$nextAmbulance->vehicle_number.')'
            ]);
        }

        return self::SUCCESS;
    }
}