<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_unauthorized_without_token()
    {
        $response = $this->getJson('/api/profile');
        $response->assertStatus(401);
    }

    public function test_get_all_users()
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
        ])->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_get_departments()
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
        ])->getJson('/api/departments');

        $response->assertStatus(200);
    }
}