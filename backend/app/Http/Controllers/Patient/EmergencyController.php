<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmergencyRequest;
use App\Models\Ambulance;
use Illuminate\Support\Facades\Auth;
use App\Models\EmergencyLog;


class EmergencyController extends Controller
{

   public function createEmergency(Request $request)
{

    $request->validate([
     'ambulance_id' => 'required|exists:ambulances,id',
    'emergency_type'=>'required',
    'severity'=>'required',
    'latitude'=>'required',
    'longitude'=>'required'

]);




    // Prevent duplicate emergency

    $existing = EmergencyRequest::where('patient_id', Auth::id())
        ->where('status','!=','Completed')
        ->first();


    if($existing){

        return response()->json([
            "message"=>"You already have an active emergency request"
        ],400);

    }



    // Find ambulance

    $ambulance = Ambulance::findOrFail($request->ambulance_id);

if ($ambulance->status != 'Available') {
    return response()->json([
        'message' => 'This ambulance is no longer available.'
    ], 400);
}


    if(!$ambulance){

        return response()->json([
            "message"=>"No ambulance available"
        ],400);

    }

    // Create emergency

    $emergency = EmergencyRequest::create([

        'patient_id' => Auth::id(),

        'ambulance_id' => $ambulance->id,

        'emergency_type' => $request->emergency_type,

        'severity' => $request->severity,

        'latitude' => $request->latitude,

        'longitude' => $request->longitude,

        'description' => $request->description,

        'status' => 'Pending',

        'assigned_at' => now(),

    ]);

    EmergencyLog::create([
    'emergency_request_id' => $emergency->id,
    'status' => 'Emergency Requested'
]);

EmergencyLog::create([
    'emergency_request_id' => $emergency->id,
    'status' => 'Ambulance Assigned'
]);


    // Make ambulance busy

    $ambulance->update([

        'status'=>'Busy'

    ]);



    return response()->json([

        'message'=>'Emergency request created',

        'emergency'=>$emergency,

        'assigned_ambulance'=>$ambulance

    ]);

}
public function publicEmergency(Request $request)
{
    $request->validate([
        'name' => 'required',
        'phone' => 'required',
        'emergency_type' => 'required',
        'latitude' => 'required',
        'longitude' => 'required'
    ]);

    // Find available ambulance
  



    // Create emergency
    $emergency = EmergencyRequest::create([
        'patient_id' => null,
        'patient_name' => $request->name,
        'patient_phone' => $request->phone,
        'ambulance_id' => $ambulance->id,
        'emergency_type' => $request->emergency_type,
        'severity' => 'Critical',
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
        'description' => $request->description,
        'status' => 'Pending'   ,
        'assigned_at' => now(),
    ]);

    
    EmergencyLog::create([
    'emergency_request_id'=> $emergency->id,
    'status'=>'Emergency Requested'
]);

EmergencyLog::create([
    'emergency_request_id' => $emergency->id,
    'status' => 'Ambulance Assigned'
]);

    $ambulance->update([
        'status' => 'Busy'
    ]);

    return response()->json([
        'message' => 'Emergency request created successfully',
        'emergency' => $emergency
    ]);
}

public function timeline($id)
{
    $logs = EmergencyLog::where(
        'emergency_request_id',
        $id
    )
    ->orderBy('created_at', 'asc')
    ->get();


    return response()->json([
        'timeline' => $logs
    ]); 
}


public function currentEmergency()
{
    $emergency = EmergencyRequest::with(['ambulance.driver'])
        ->where('patient_id', Auth::id())
        ->whereNotIn('status', [
    'Completed',
    'Cancelled'
])
        ->latest()
        ->first();


    if(!$emergency){

        return response()->json([
            'message'=>'No active emergency'
        ],404);

    }


    $logs = EmergencyLog::where(
    'emergency_request_id',
    $emergency->id
)
    ->orderBy('created_at')
    ->get();

    return response()->json([
        'emergency' => $emergency,
        'logs' => $logs
    ]); 
    }
}