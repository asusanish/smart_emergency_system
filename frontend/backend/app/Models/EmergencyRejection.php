<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyRejection extends Model
{
    protected $fillable = [
        'emergency_request_id',
        'ambulance_id',
    ];
}