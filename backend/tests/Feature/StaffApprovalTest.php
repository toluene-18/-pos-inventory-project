<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('manager can access product and report routes as a management role', function () {
    /** @var \Tests\TestCase $this */
    $manager = User::factory()->create([
        'role' => 'manager',
        'status' => 'active',
    ]);

    $this->actingAs($manager, 'sanctum')
        ->getJson('/api/products')
        ->assertOk();

    $this->actingAs($manager, 'sanctum')
        ->getJson('/api/reports/sales')
        ->assertOk();
});

test('new staff accounts start pending until the owner approves them', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create([
        'role' => 'owner',
        'status' => 'active',
    ]);

    $response = $this->postJson('/api/register', [
        'name' => 'Sarah Clerk',
        'email' => 'sarah@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'cashier',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('user.status', 'pending');
    $response->assertJsonPath('user.role', 'cashier');

    $user = User::where('email', 'sarah@example.com')->firstOrFail();
    expect($user->status)->toBe('pending');

    $this->actingAs($owner, 'sanctum')
        ->patchJson('/api/staff/' . $user->id . '/approve', [
            'role' => 'manager',
            'status' => 'active',
        ])
        ->assertOk()
        ->assertJsonPath('user.role', 'manager')
        ->assertJsonPath('user.status', 'active');

    $user->refresh();
    expect($user->role)->toBe('manager');
    expect($user->status)->toBe('active');
    expect($user->approved_by)->toBe($owner->id);
    expect($user->approved_at)->not->toBeNull();
});

test('pending staff cannot sign in until approved', function () {
    /** @var \Tests\TestCase $this */
    $pendingUser = User::factory()->create([
        'role' => 'cashier',
        'status' => 'pending',
        'password' => Hash::make('Password123!'),
    ]);

    $this->postJson('/api/login', [
        'email' => $pendingUser->email,
        'password' => 'Password123!',
    ])->assertStatus(403);
});
