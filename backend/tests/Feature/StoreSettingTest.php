<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_store_settings(): void
    {
        $response = $this->getJson('/api/store-settings');

        $response->assertStatus(200)
            ->assertJsonStructure(['name', 'state', 'city', 'country']);
    }

    public function test_owner_can_update_store_settings(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'status' => 'active',
        ]);

        $payload = [
            'name' => 'CWG Provisions Store Ogun',
            'state' => 'Ogun State',
            'city' => 'Abeokuta',
            'country' => 'Nigeria',
        ];

        $response = $this->actingAs($owner, 'sanctum')
            ->postJson('/api/store-settings', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('settings.name', 'CWG Provisions Store Ogun')
            ->assertJsonPath('settings.state', 'Ogun State');

        $this->getJson('/api/store-settings')
            ->assertStatus(200)
            ->assertJsonPath('name', 'CWG Provisions Store Ogun')
            ->assertJsonPath('state', 'Ogun State');
    }

    public function test_cashier_cannot_update_store_settings(): void
    {
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'status' => 'active',
        ]);

        $response = $this->actingAs($cashier, 'sanctum')
            ->postJson('/api/store-settings', [
                'name' => 'Hacked Store',
            ]);

        $response->assertStatus(403);
    }
}
