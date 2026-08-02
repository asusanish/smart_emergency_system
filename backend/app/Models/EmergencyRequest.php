<?php

namespace App\Models;

use App\Models\User;
use App\Models\Ambulance;
use App\Models\EmergencyLog;
use Illuminate\Database\Eloquent\Model;

class EmergencyRequest extends Model
{
    protected $fillable = [

        'patient_id',
        'patient_name',
        'patient_phone',
        'ambulance_id',
        'emergency_type',
        'severity',
        'latitude',
        'longitude',
        'description',
        'status',
        'assigned_at',

    ];

    public const ACTIVE_STATUSES = [
        'Pending',
        'Waiting',
        'Reassigning',
        'Accepted',
        'On The Way',
    ];


    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }


    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class, 'ambulance_id');
    }

    public function logs()
    {
        return $this->hasMany(
            EmergencyLog::class,
            'emergency_request_id'
        );
    }
}
