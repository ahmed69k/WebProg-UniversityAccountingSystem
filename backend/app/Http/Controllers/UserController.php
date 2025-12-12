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
            'credit_card'=>"required|string|min:16|max:16"
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
    public function update(Request $request, $id){
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'profile_picture' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048|nullable'

        ]);
        if(isset($validated['password'])){
            $validated['password'] = Hash::make($validated['password']);
        }
        if($request->hasFile('profile_picture')){
            $file = $request->file('profile_picture');
            $filename = uniqid().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('profile_pictures'),$filename);
            $validated['profile_picture']=url('profile_pictures/'.$filename);
        }
        $user->update($validated);
        if($user->profile_picture){
            $user->profile_picture = url($user->profile_picture);
        }
        return response()->json([
            'message'=>'User updated successfully!',
            'user'=>$user,
            'affected_fields'=>$validated
        ],200);
    }
    public function getCreditCard(Request $request){
        $user = $request->user();
        $credit = $user->credit_card;
        return response()->json([
            'message'=>"Credit card retrieved.",
            'credit_card'=>$credit
        ]);
    }
    public function getAllUsers(Request $request){
        $user = $request->user();
        if($user->role !=="Admin"){
            return response()->json([
                'message'=>"Invalid role!",
                'role'=>$user->role
            ]);
        }
        $users = User::all();
        return response()->json([
            'message'=>"All users retrieved successfully!",
            'users'=>$users
        ]);
    
    }
    public function deleteUser(Request $request, $id){
        $user = $request->user();
        if($user->role!=="Admin"){
            return response()->json([
                'message'=>"Invalid role!",
                'role'=>$user->role
            ]);            
        }
        $foundUser = User::findorFail($id);
        $foundUser->delete();
        return response()->json([
            'message'=>"User deleted successfully!",
            'deleted_user'=>$foundUser
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
