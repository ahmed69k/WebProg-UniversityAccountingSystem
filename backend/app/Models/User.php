<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,HasFactory,Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_picture',
        "credit_card"
    ];

    protected $hidden = [
        'password',
        'credit_card'
    ];

    public function fee(){
        return $this->hasMany(Fee::class);
    }

    public function salary(){
        return $this->hasMany(Salary::class);
    }
}
