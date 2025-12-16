<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    protected $fillable = [
        'type',
        'amount',
        'isPaid',
        'user_id'
    ];
    
    protected $casts = [
        'amount'=>'float',
        'isPaid'=>'boolean'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
