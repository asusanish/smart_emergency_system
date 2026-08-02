<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $request->validate([
            'name'=>'required',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6',
            'phone'=>'required'
        ]);


        $user = User::create([

            'name'=>$request->name,

            'email'=>$request->email,

            'phone'=>$request->phone,

            'password'=>Hash::make($request->password),

            'role'=>'patient'

        ]);


        return response()->json([

            'message'=>'Registration successful',

            'user'=>$user

        ]);

    }


    public function login(Request $request)
    {

        $user = User::where(
            'email',
            $request->email
        )->first();


        if(!$user || !Hash::check(
            $request->password,
            $user->password
        ))
        {

            return response()->json([
                'message'=>'Invalid credentials'
            ],401);

        }


        $token = $user->createToken(
            'auth_token'
        )->plainTextToken;


        return response()->json([

            'message'=>'Login successful',

            'token'=>$token,

            'user'=>$user

        ]);

    }

}