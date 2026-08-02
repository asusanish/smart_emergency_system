<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller
{

    public function profile()
    {
        return response()->json([
            "profile" => Auth::user()
        ]);
    }



    public function updateProfile(Request $request)
    {

        $user = User::find(Auth::id());


        $request->validate([
            "name" => "required|string",
            "phone" => "nullable|string",
        ]);


        $user->update([
            "name" => $request->name,
            "phone" => $request->phone,
        ]);


        return response()->json([
            "message" => "Profile updated",
            "profile" => $user
        ]);
    }




   public function changePassword(Request $request)
{
    $user = User::find(Auth::id());


    $request->validate([
        "current_password"=>"required",
        "new_password"=>"required|min:6"
    ]);


    if(!Hash::check(
        $request->current_password,
        $user->password
    )){

        return response()->json([
            "message"=>"Current password incorrect"
        ],400);

    }


    $user->update([
        "password"=>Hash::make(
            $request->new_password
        )
    ]);


    return response()->json([
        "message"=>"Password changed"
    ]);
}
}
