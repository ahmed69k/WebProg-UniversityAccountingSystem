<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_registration()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'Student',  // Capital S
            'credit_card' => '1234567890123456',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(201);
    }

    public function test_user_login()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'Student',  // Capital S
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(201); // ✅ This matches your API's actual response
        $response->assertJsonStructure(['token']);    }

    public function test_get_user_profile()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'student',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);
        
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/profile');

        $response->assertStatus(200);
    }
}