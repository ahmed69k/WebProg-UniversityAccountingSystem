<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function store(Request $request){
        $user = $request->user();
        if($user->role !=="Admin"){
            return response()->json([
                'message'=>"Unauthorized!",
                'role'=>$user->role
            ]);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'totalBudget' => 'required|integer|min:0',
            'allocatedBudget' => 'required|integer|min:0|lte:totalBudget',
        ]);

        $validated['remainingBudget'] = $validated['totalBudget'] - $validated['allocatedBudget'];

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully!',
            'department' => $department
        ], 201);
    }
    public function getAll(Request $request){
        $user = $request->user();
        if($user->role !=="Admin"){
            return response()->json([
                'message'=>"Unauthorized!",
                'role'=>$user->role
            ]);
        }

        $departments = Department::all();
        return response()->json([
            'message'=>"Departments retrieved successfully!",
            'departments'=>$departments
        ]);
    }
    public function delete(Request $request, $id){
        $user = $request->user();
        if($user->role !=="Admin"){
            return response()->json([
                'message'=>"Unauthorized!",
                'role'=>$user->role
            ]);            
        }
        $deletedDepartment = Department::findOrFail($id);
        $deletedDepartment->delete();
        return response()->json([
            'message'=>"Department deleted successfully!",
            'deleted_department'=>$deletedDepartment
        ]);        
        
    }
public function update(Request $request, $id)
{
    $user = $request->user();

    if ($user->role !== "Admin") {
        return response()->json([
            'message' => 'Unauthorized!'
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'sometimes|string',
        'totalBudget' => 'sometimes|integer|min:0',
        'allocatedBudget' => 'sometimes|integer|min:0'
    ]);

    $department = Department::findOrFail($id);

    $totalBudget = $validated['totalBudget'] ?? $department->totalBudget;
    $allocatedBudget = $validated['allocatedBudget'] ?? $department->allocatedBudget;

    $validated['remainingBudget'] = $totalBudget - $allocatedBudget;

    $department->update($validated);

    return response()->json([
        'message' => 'Department updated successfully!',
        'updated_department' => $department
    ]);
}

}
