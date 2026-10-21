<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductVisibilityTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(): Product
    {
        $product = Product::create([
            'name' => 'Test Rice 5kg',
            'sku' => 'TR-5',
            'category' => 'groceries',
            'cost_price' => 7000,
            'sell_price' => 9500,
            'is_active' => true,
        ]);
        $product->inventory()->create(['quantity' => 10, 'reorder_threshold' => 2]);

        return $product;
    }

    public function test_cashier_does_not_receive_cost_price(): void
    {
        $this->makeProduct();
        Sanctum::actingAs(User::factory()->create(['role' => 'cashier']));

        $response = $this->getJson('/api/products')->assertOk();

        $this->assertArrayNotHasKey('cost_price', $response->json(0));
        $this->assertEquals('9500.00', $response->json('0.sell_price'));
        $this->assertEquals(10, $response->json('0.inventory.quantity'));
    }

    public function test_owner_receives_cost_price(): void
    {
        $this->makeProduct();
        Sanctum::actingAs(User::factory()->create(['role' => 'owner']));

        $response = $this->getJson('/api/products')->assertOk();

        $this->assertEquals(7000, $response->json('0.cost_price'));
    }

    public function test_guest_cannot_list_products(): void
    {
        $this->getJson('/api/products')->assertUnauthorized();
    }
}
