<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use App\Models\User;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
   public function addSalaryToAllStaff(Request $request){
    $user = $request->user();
    if($user->role!=="Admin"){
        return response()->json([
            'message'=>"Unauthorized!",
            'role'=>$user->role
        ]);
    }
    $staffUsers = User::where('role','Staff')->get();
    $validated = $request->validate([
        'month'=>'string|required',
        'base_salary'=>'integer|required|min:0',
        'bonus'=>'integer|nullable',
        'deductions'=>'integer|nullable'
    ]);
    foreach($staffUsers as $staff){
        Salary::create([
            'month'=>$validated['month'],
            'base_salary'=>$validated['base_salary'],
            'bonus'=>$validated['bonus']??0,
            'deductions'=>$validated['deductions']??0,
            'user_id'=>$staff['id']
        ]);
    }
    return response()->json([
        'message'=>"Salary applied to all staff!",
        'staff'=>$staffUsers,
        'salary'=>$validated
    ]);
   }
    public function addBonusOrDeductions(Request $request, $id){
        $user = $request->user();

        if ($user->role !== "Admin") {
            return response()->json([
                'message' => "Unauthorized!",
                'role' => $user->role
            ], 403);
        }

        $validated = $request->validate([
            'bonus' => 'integer|nullable|min:0',
            'deductions' => 'integer|nullable|min:0',
            'month' => 'string|required'
        ]);

        $staff = User::findOrFail($id);

        $salary = Salary::where('month', $validated['month'])
                        ->where('user_id', $id)
                        ->first();

        if (!$salary) {
            return response()->json([
                'message' => "Salary record not found for this user and month."
            ], 404);
        }

        $updateData = [];
        if (isset($validated['bonus'])) {
            $updateData['bonus'] = $validated['bonus'];
        }
        if (isset($validated['deductions'])) {
            $updateData['deductions'] = $validated['deductions'];
        }

        if (!empty($updateData)) {
            $salary->update($updateData);
        }

        return response()->json([
            'message' => "Salary updated for staff ID $id",
            'salary' => $salary
        ]);
    }
    public function getSalaryForEmployee(Request $request){
        $user = $request->user();
        if($user->role!=="Staff"){
            return response()->json([
                'message' => "Unauthorized!",
                'role' => $user->role
            ], 403);  
        }
        $salary = Salary::where('user_id',$user->id)->get();
        return response()->json([
            'message'=>"Salary for staff member with id $user->id retrieved",
            'salary'=>$salary
        ]);
    }
    public function getAll(Request $request){
        $user = $request->user();
        if($user->role!=="Admin"){
            return response()->json([
                'message' => "Unauthorized!",
                'role' => $user->role
            ], 403);  
        }
        $salary = Salary::with('user:id,name,email')->get();
        return response()->json([
            'message'=>'Salaries for all staff members retrieved!',
            'salaries'=>$salary
        ]);
    }

}
