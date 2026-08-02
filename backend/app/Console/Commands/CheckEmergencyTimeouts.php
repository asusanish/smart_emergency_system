<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EmergencyRequest;
use App\Models\EmergencyRejection;
use App\Models\EmergencyLog;
use App\Models\Ambulance;
use App\Services\DispatchService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckEmergencyTimeouts extends Command
{
    protected $signature = 'emergency:timeouts';

    protected $description = 'Automatically reassign emergencies when drivers do not respond';

    public function handle()
    {
        Log::info('Emergency timeout command started');
        $dispatchService = new DispatchService();

        $emergencies = EmergencyRequest::with('ambulance.driver')
            ->whereIn('status', [
                'Pending',
                'Waiting'
            ])
            ->whereNotNull('assigned_at')
            ->whereDoesntHave('logs', function ($query) {

                $query->where(
                    'status',
                    'like',
                    '%did not respond%'
                );
            })
            ->get();

        Log::info('Pending emergencies found: ' . $emergencies->count());



        foreach ($emergencies as $emergency) {

            if ($emergency->status == "Waiting") {

                if (
                    Carbon::parse($emergency->waiting_started_at)
                    ->diffInMinutes(now()) >= 5
                ) {

                    $emergency->update([
                        'status' => 'Cancelled'
                    ]);


                    EmergencyLog::create([
                        'emergency_request_id' => $emergency->id,
                        'status' => 'Emergency cancelled because no ambulance was available.'
                    ]);

                    continue;
                }
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
                'status' => 'Driver ' . $currentAmbulance->driver->name . ' did not respond within 30 seconds.'
            ]);

            Log::info('Reached second timeout log');

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
                    'status' => 'All ambulances are currently busy.'
                ]);

                EmergencyLog::create([
                    'emergency_request_id' => $emergency->id,
                    'status' => 'Waiting for the next available ambulance.'
                ]);
                Log::info('Emergency moved to waiting queue');

                continue;
            }

            EmergencyLog::create([
                'emergency_request_id' => $emergency->id,
                'status' => 'Assigned to ' . $nextAmbulance->driver->name .
                    ' (' . $nextAmbulance->vehicle_number . ')'
            ]);
            Log::info('Emergency reassigned successfully');
        }

        return self::SUCCESS;
    }
}
