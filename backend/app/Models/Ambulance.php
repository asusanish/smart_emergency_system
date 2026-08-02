<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ambulance extends Model
{
    protected $fillable = [

        'driver_id',
        'vehicle_number',
        'type',
        'status',
        'latitude',
        'longitude'

    ];


    public function driver()
    {
        return $this->belongsTo(
            User::class,
            'driver_id'
        );
    }
}