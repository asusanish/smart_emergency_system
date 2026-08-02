<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyLog extends Model
{

    protected $fillable = [
        'emergency_request_id',
        'status'
    ];


    public function emergency()
    {
        return $this->belongsTo(
            EmergencyRequest::class,
            'emergency_request_id'
        );
    }

}