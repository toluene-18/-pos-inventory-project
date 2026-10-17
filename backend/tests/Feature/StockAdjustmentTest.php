<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Inventory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockAdjustmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_increase_stock(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'sku' => 'TEST-STOCK-001',
            'category' => 'Test',
            'cost_price' => 5,
            'sell_price' => 10,
            'is_active' => true,
        ]);

        Inventory::create([
            'product_id' => $product->id,
            'quantity' => 10,
            'reorder_threshold' => 5,
        ]);

        $response = $this->actingAs($owner)->postJson(
            "/api/products/{$product->id}/stock-adjustments",
            [
                'type' => 'increase',
                'quantity' => 5,
                'reason' => 'Restocked from supplier',
            ]
        );

        $response->assertCreated();

        $this->assertDatabaseHas('inventories', [
            'product_id' => $product->id,
            'quantity' => 15,
        ]);

        $this->assertDatabaseHas('stock_adjustments', [
            'product_id' => $product->id,
            'user_id' => $owner->id,
            'type' => 'increase',
            'quantity_change' => 5,
            'reason' => 'Restocked from supplier',
        ]);
    }

    public function test_owner_cannot_decrease_stock_below_zero(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'sku' => 'TEST-STOCK-002',
            'category' => 'Test',
            'cost_price' => 5,
            'sell_price' => 10,
            'is_active' => true,
        ]);

        Inventory::create([
            'product_id' => $product->id,
            'quantity' => 10,
            'reorder_threshold' => 5,
        ]);

        $response = $this->actingAs($owner)->postJson(
            "/api/products/{$product->id}/stock-adjustments",
            [
                'type' => 'decrease',
                'quantity' => 15,
                'reason' => 'Testing insufficient stock',
            ]
        );

        $response->assertUnprocessable();

        $this->assertDatabaseHas('inventories', [
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $this->assertDatabaseMissing('stock_adjustments', [
            'product_id' => $product->id,
            'type' => 'decrease',
            'quantity_change' => -15,
        ]);
    }

    public function test_cashier_cannot_adjust_stock(): void
    {
        $cashier = User::factory()->create([
            'role' => 'cashier',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'sku' => 'TEST-STOCK-003',
            'category' => 'Test',
            'cost_price' => 5,
            'sell_price' => 10,
            'is_active' => true,
        ]);

        Inventory::create([
            'product_id' => $product->id,
            'quantity' => 10,
            'reorder_threshold' => 5,
        ]);

        $response = $this->actingAs($cashier)->postJson(
            "/api/products/{$product->id}/stock-adjustments",
            [
                'type' => 'increase',
                'quantity' => 5,
                'reason' => 'Testing cashier permissions',
            ]
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('inventories', [
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $this->assertDatabaseMissing('stock_adjustments', [
            'product_id' => $product->id,
            'type' => 'increase',
            'quantity_change' => 5,
        ]);
    }
}
