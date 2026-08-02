<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Ambulance;
use App\Models\EmergencyRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class AdminController extends Controller
{

    public function dashboard()
    {

        $activeEmergencies = EmergencyRequest::with([
            'ambulance.driver',
            'patient'
        ])
            ->whereNotIn('status', [
                'Completed',
                'Cancelled'
            ])
            ->latest()
            ->get();
        return response()->json([

            "total_users" => User::count(),

            "total_ambulances" => Ambulance::count(),

            "available_ambulances" => Ambulance::where(
                'status',
                'Available'
            )->count(),

            "active_emergencies" => EmergencyRequest::whereNotIn(
                'status',
                ['Completed', 'Cancelled']
            )->count(),

            "completed_emergencies" => EmergencyRequest::where(
                'status',
                'Completed'
            )->count(),

            "live_emergencies" => $activeEmergencies

        ]);
    }

    public function ambulances()
    {

        $ambulances = Ambulance::with('driver')
            ->get();


        return response()->json([
            "ambulances" => $ambulances
        ]);
    }

    public function users()
    {
        $users = User::all();

        return response()->json([
            "users" => $users
        ]);
    }

    public function drivers()
    {

        $drivers = User::where(
            'role',
            'driver'
        )
            ->with('ambulance')
            ->get();


        return response()->json([
            "drivers" => $drivers
        ]);
    }


    public function emergencyHistory(Request $request)
    {
        $query = EmergencyRequest::with([
            'patient',
            'ambulance.driver'
        ]);


        // Search patient name
        if ($request->search) {

            $query->whereHas('patient', function ($q) use ($request) {

                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }


        // Status filter
        if ($request->status) {

            $query->where(
                'status',
                $request->status
            );
        }


        // Severity filter
        if ($request->severity) {

            $query->where(
                'severity',
                $request->severity
            );
        }


        // Emergency type filter
        if ($request->type) {

            $query->where(
                'emergency_type',
                $request->type
            );
        }


        $emergencies = $query
            ->latest()
            ->get();


        return response()->json([
            "emergencies" => $emergencies
        ]);
    }

    public function analytics()
    {

        // Total emergencies

        $totalEmergencies = EmergencyRequest::count();



        // Today's emergencies

        $todayEmergencies = EmergencyRequest::whereDate(
            'created_at',
            Carbon::today()
        )->count();



        // Completed emergencies

        $completed = EmergencyRequest::where(
            'status',
            'Completed'
        )->count();



        // Active emergencies

        $active = EmergencyRequest::whereIn(
            'status',
            [
                'Pending',
                'Searching',
                'Assigned',
                'Accepted',
                'On The Way'
            ]
        )->count();




        // Most used ambulance

        $topAmbulance = EmergencyRequest::select(
            'ambulance_id'
        )
            ->whereNotNull('ambulance_id')
            ->groupBy('ambulance_id')
            ->orderByRaw(
                'COUNT(*) DESC'
            )
            ->first();



        $ambulance = null;


        if ($topAmbulance) {

            $ambulance = Ambulance::find(
                $topAmbulance->ambulance_id
            );
        }





        // Most active driver

        $topDriver = EmergencyRequest::with(
            'ambulance.driver'
        )
            ->whereNotNull('ambulance_id')
            ->get()
            ->groupBy(
                fn($item) =>
                $item->ambulance?->driver_id
            )
            ->sortByDesc(
                fn($group) =>
                $group->count()
            )
            ->first();


        // Weekly emergency trend

        $weekly = EmergencyRequest::select(
            DB::raw("DATE(created_at) as date"),
            DB::raw("COUNT(*) as count")
        )
            ->where(
                'created_at',
                '>=',
                Carbon::now()->subDays(7)
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();



        // Status distribution

        $statusDistribution = EmergencyRequest::select(
            'status',
            DB::raw("COUNT(*) as count")
        )
            ->groupBy('status')
            ->get();



        // Ambulance usage

        $ambulanceUsage = EmergencyRequest::with(
            'ambulance'
        )
            ->whereNotNull('ambulance_id')
            ->select(
                'ambulance_id',
                DB::raw("COUNT(*) as count")
            )
            ->groupBy('ambulance_id')
            ->limit(5)
            ->get();



        return response()->json([

            "total_emergencies" => $totalEmergencies,

            "today_emergencies" => $todayEmergencies,

            "completed" => $completed,

            "active" => $active,


            "top_ambulance" => $ambulance,

            "top_driver" => $topDriver?->first()?->ambulance?->driver,


            "weekly" => $weekly,

            "status_distribution" => $statusDistribution,

            "ambulance_usage" => $ambulanceUsage


        ]);
    }

    public function liveEmergencies()
    {

        $emergencies = EmergencyRequest::with([
            'patient',
            'ambulance.driver'
        ])
            ->whereIn(
                'status',
                [
                    'Pending',
                    'Searching',
                    'Assigned',
                    'Accepted',
                    'On The Way'
                ]
            )
            ->latest()
            ->get();


        return response()->json([

            "count" => $emergencies->count(),

            "emergencies" => $emergencies

        ]);
    }
}
