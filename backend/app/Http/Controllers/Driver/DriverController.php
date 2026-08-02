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
        ->where('status','!=','Completed')
        ->get();

        return response()->json([
            'driver'=>Auth::id(),
            'emergencies'=>$requests
        ]);

        }


        public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status'=>'required'
        ]);


        $emergency = EmergencyRequest::findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | DRIVER REJECTED
        |--------------------------------------------------------------------------
        */

        if ($request->status == "Rejected")
{
    // Current ambulance
    $currentAmbulance = Ambulance::find($emergency->ambulance_id);

    if (!$currentAmbulance) {
        return response()->json([
            'message' => 'Current ambulance not found.'
        ], 404);
    }

    // Make current ambulance available
    $currentAmbulance->update([
        'status' => 'Available'
    ]);

    // Remember that this ambulance rejected this emergency
    EmergencyRejection::create([
        'emergency_request_id' => $emergency->id,
        'ambulance_id' => $currentAmbulance->id,
    ]);
    $emergency->update([
    'status' => 'Reassigning'
    ]);
    // Dispatch another ambulance
    $dispatchService = new DispatchService();

    $nearestAmbulance = $dispatchService->assignNearestAmbulance($emergency);

    if (!$nearestAmbulance) {

        $emergency->update([
            'status' => 'No Ambulance Available'
        ]);

        EmergencyLog::create([
            'emergency_request_id' => $emergency->id,
            'status' => 'No ambulance available after rejection.'
        ]);

        return response()->json([
            'message' => 'No ambulance available for reassignment.'
        ], 400);
    }

    $emergency->refresh();

    EmergencyLog::create([
        'emergency_request_id' => $emergency->id,
        'status' => 'Driver '.$currentAmbulance->driver->name.' rejected the request.'
    ]);

    EmergencyLog::create([
        'emergency_request_id' => $emergency->id,
        'status' => 'Searching for another ambulance...'
    ]);

    EmergencyLog::create([
        'emergency_request_id' => $emergency->id,
        'status' => 'Assigned to '.$nearestAmbulance->driver->name.
                    ' ('.$nearestAmbulance->vehicle_number.')'
    ]);

    $emergency->update([
    'status' => 'Pending'
    ]);

    return response()->json([
        'message' => 'Emergency reassigned successfully.',
        'ambulance' => $nearestAmbulance,
        'emergency' => $emergency
    ]);
}



        /*
        |--------------------------------------------------------------------------
        | NORMAL STATUS UPDATE
        |--------------------------------------------------------------------------
        */


        $emergency->update([

            'status'=>$request->status

        ]);



        EmergencyLog::create([

            'emergency_request_id'=>$emergency->id,

            'status'=>$request->status

        ]);




        /*
        |--------------------------------------------------------------------------
        | COMPLETED
        |--------------------------------------------------------------------------
        */

        if($request->status == "Completed")
        {

            $ambulance = Ambulance::find(
                $emergency->ambulance_id
            );


            if($ambulance)
            {

                $ambulance->update([

                    'status'=>'Available'

                ]);

            }

        }



        return response()->json([

            'message'=>'Emergency status updated',

            'emergency'=>$emergency

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
    }