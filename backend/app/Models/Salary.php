<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    protected $fillable = [
        'month',
        'base_salary',
        'bonus',
        'deductions',
        'user_id'
    ];

    protected $casts = [
        'base_salary'=>'float',
        'bonus'=>'float',
        'deductions'=>'float'
    ];
    
    public function user(){
        return $this->belongsTo(User::class);
    }

}
