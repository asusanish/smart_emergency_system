<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:check-emergency-timeouts')]
#[Description('Command description')]
class CheckEmergencyTimeouts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredRequests = EmergencyRequest::where('status', 'Pending')
    ->where('assigned_at', '<', now()->subSeconds(20))
    ->get();

foreach ($expiredRequests as $emergency) {

    // mark current ambulance available

    // record rejection

    // DispatchService->assignNearestAmbulance($emergency);

}
    }
}
