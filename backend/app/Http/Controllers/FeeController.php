<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use Illuminate\Http\Request;

class FeeController extends Controller
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
        $user = $request->user();
        if($user->role !== 'Accounting Personnel'){
            return response()->json([
                'message'=>'Not allowed!',
                'role'=>$user->role
            ],500);
        }
        $validated = $request->validate([
            'type'=>'required|string',
            'amount'=>'required|integer',
            'isPaid'=>'nullable|boolean',
            'user_id'=>'required|exists:users,id'
        ]);
        $fee = Fee::create($validated);
        return response()->json([
            'message'=>'Fee created succesfully for user' . $validated['user_id'],
            'fee'=>$fee
        ]);
    }
    public function delete(Request $request, $id){
        $user = $request->user();
        if($user->role !== "Accounting Personnel"){
            return response()->json([
                'message'=>'Not allowed!',
                'role'=>$user->role
            ]);
        }
        $fee = Fee::find($id);
        if(!$fee){
            return response()->json([
                'message'=>"Fee with ID " . $id . ' not found!'
            ],500);
        }
        $fee->delete();
        return response()->json([
            'message'=>'Fee with ID '.$id.' deleted successfully!',
            'fee'=>$fee
        ]);
    }
    public function getAllFees(Request $request){
        $user = $request->user();
        if($user->role !== "Accounting Personnel"){
            return response()->json([
                'message'=>'Not allowed!',
                'role'=>$user->role
            ]);
        }
        $fees = Fee::all();
        return response()->json([
            'message'=>"Fees returned successfully!",
            'fees'=>$fees
        ]);
    }
    public function getFeeById(Request $request, $id){
        $user = $request->user();
        if($user->role !== "Accounting Personnel"){
            return response()->json([
                'message'=>'Not allowed!',
                'role'=>$user->role
            ]);
        }
        $fee = Fee::find($id);
        if(!$fee){
            return response()->json([
                'message'=>"Fee with ID " . $id . ' not found!'
            ],500);
        }
        return response()->json([
            'message'=>'Fee with ID ' . $id . ' returned successfully!',
            'fee'=>$fee
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
