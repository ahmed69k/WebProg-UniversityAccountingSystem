<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Salary;

class SalaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_salary_to_all_staff()
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'Admin',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        // Create some staff users
        $staff1 = User::create([
            'name' => 'Staff 1',
            'email' => 'staff1@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $staff2 = User::create([
            'name' => 'Staff 2',
            'email' => 'staff2@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/salary/to-all-staff', [
            'month' => 'January',
            'base_salary' => 5000,
            'bonus' => 500,
            'deductions' => 200
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Salary applied to all staff!'
        ]);

        // Check if salaries were created
        $this->assertCount(2, Salary::all());
    }

    public function test_non_admin_cannot_add_salary()
    {
        // Create a non-admin user (Staff role)
        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $token = $staff->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/salary/to-all-staff', [
            'month' => 'January',
            'base_salary' => 5000
        ]);

        // Now returns 403 (correct!)
        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Unauthorized!'
        ]);
    }

    public function test_admin_can_update_bonus_or_deductions()
    {
        // Create admin and staff
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'Admin',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        // Create a salary record first
        $salary = Salary::create([
            'month' => 'January',
            'base_salary' => 5000,
            'bonus' => 0,
            'deductions' => 0,
            'user_id' => $staff->id
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/salary/bonus-or-deductions/{$staff->id}", [
            'month' => 'January',
            'bonus' => 1000,
            'deductions' => 200
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => "Salary updated for staff ID {$staff->id}"
        ]);

        // Check if salary was updated
        $updatedSalary = Salary::find($salary->id);
        $this->assertEquals(1000, $updatedSalary->bonus);
        $this->assertEquals(200, $updatedSalary->deductions);
    }

    public function test_staff_can_view_their_own_salary()
    {
        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        // Create salary for this staff
        Salary::create([
            'month' => 'January',
            'base_salary' => 5000,
            'bonus' => 500,
            'deductions' => 200,
            'user_id' => $staff->id
        ]);

        $token = $staff->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/salary');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'salary' => [
                '*' => ['month', 'base_salary', 'bonus', 'deductions']
            ]
        ]);
    }

    public function test_admin_can_view_all_salaries()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'Admin',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        // Create salary
        Salary::create([
            'month' => 'January',
            'base_salary' => 5000,
            'bonus' => 500,
            'deductions' => 200,
            'user_id' => $staff->id
        ]);

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/salary/all');

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Salaries for all staff members retrieved!'
        ]);
    }

    public function test_non_admin_cannot_view_all_salaries()
    {
        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'Staff',
            'credit_card' => '1234567890123456',
            'password' => bcrypt('password123')
        ]);

        $token = $staff->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/salary/all');

        $response->assertStatus(403); // Should be 403
        $response->assertJson([
            'message' => 'Unauthorized!'
        ]);
    }
}