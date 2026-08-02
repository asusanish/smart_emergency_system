<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Ambulance;
use App\Models\EmergencyRequest;


class AdminController extends Controller
{

    public function dashboard()
    {

        return response()->json([

            "total_users" => User::count(),

            "total_ambulances" => Ambulance::count(),

            "available_ambulances" => Ambulance::where(
                'status',
                'Available'
            )->count(),


            "active_emergencies" => EmergencyRequest::where(
                'status',
                '!=',
                'Completed'
            )->count(),


            "completed_emergencies" => EmergencyRequest::where(
                'status',
                'Completed'
            )->count()

        ]);

    }

}