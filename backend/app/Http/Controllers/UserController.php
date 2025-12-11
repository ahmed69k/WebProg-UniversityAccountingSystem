<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=>'required|string|max:255|min:1',
            'email'=>'required|string|email|max:255|unique:users',
            'password'=>'required|string|min:6',
            'role'=>'required|in:Admin,Accounting Personnel,Student,Staff',
            'profile_picture'=>'nullable|string',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json([
            'message'=>'User created successfully!',
            'user'=>$user
        ],201);
    }

    public function login(Request $request){
        $credentials = $request ->validate([
            'email'=>'required|email',
            'password'=>'required|string'
        ]);
        $user = User::where('email',$credentials['email'])->first();
        if(!$user ||!Hash::check($credentials['password'],$user->password)){
            return response()->json([
                'message'=> 'Invalid credentials'
            ],401);
        }
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message'=>'Logged in successfully!',
            'user'=>$user,
            'token'=>$token
        ],201);
    }

    public function profile(Request $request){
        $user = $request->user();
        return response()->json([
            'message'=>'User profile successfully!',
            'user'=>$user
        ],200);
    }

    public function logout(Request $request){
        if($request->user()?->currentAccessToken()){
            $request->user()->currentAccessToken()->delete();
        }
        return response()->json([
            'message'=> 'Logged out successfully!'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
