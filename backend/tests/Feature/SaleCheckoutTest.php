<?php

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createCheckoutProduct(int $stock = 10): Product
{
    $product = Product::create([
        'name' => 'Test Product',
        'sku' => 'TEST-' . uniqid(),
        'category' => 'Test',
        'cost_price' => 100,
        'sell_price' => 150,
        'is_active' => true,
    ]);

    Inventory::create([
        'product_id' => $product->id,
        'quantity' => $stock,
        'reorder_threshold' => 2,
    ]);

    return $product;
}

test('authenticated cashier can complete a sale', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $product = createCheckoutProduct(10);

    $response = $this->actingAs($user)->postJson('/api/sales', [
        'payment_method' => 'cash',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
    ]);

    $response->assertCreated()
    ->assertJsonPath('sale.subtotal', 300)
    ->assertJsonPath('sale.total', 300);

    $this->assertDatabaseHas('sales', [
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'total' => 300,
    ]);

    $this->assertDatabaseHas('sale_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 150,
        'line_total' => 300,
    ]);

    // Refresh product and read the related inventory quantity
    expect($product->fresh()->inventory->quantity)->toBe(8);
});

test('checkout rejects insufficient stock without creating a sale', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $product = createCheckoutProduct(2);

    $response = $this->actingAs($user)->postJson('/api/sales', [
        'payment_method' => 'cash',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 5,
            ],
        ],
    ]);

    $response->assertUnprocessable();

    $this->assertDatabaseCount('sales', 0);
    $this->assertDatabaseCount('sale_items', 0);

    // Refresh product and ensure inventory quantity unchanged
    expect($product->fresh()->inventory->quantity)->toBe(2);
});

test('checkout rejects invalid payment methods', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $product = createCheckoutProduct();

    $response = $this->actingAs($user)->postJson('/api/sales', [
        'payment_method' => 'bitcoin',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
            ],
        ],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('payment_method');

    $this->assertDatabaseCount('sales', 0);
    $this->assertDatabaseCount('sale_items', 0);
});

test('checkout rolls back all changes when one product has insufficient stock', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    // The first product has enough stock.
    $product1 = createCheckoutProduct(10);

    // The second product has insufficient stock.
    $product2 = Product::create([
        'name' => 'Second Test Product',
        'sku' => 'TEST-' . uniqid(),
        'category' => 'Test',
        'cost_price' => 100,
        'sell_price' => 200,
        'is_active' => true,
    ]);

    Inventory::create([
        'product_id' => $product2->id,
        'quantity' => 1,
        'reorder_threshold' => 2,
    ]);

    $response = $this->actingAs($user)->postJson('/api/sales', [
        'payment_method' => 'cash',
        'items' => [
            [
                'product_id' => $product1->id,
                'quantity' => 2,
            ],
            [
                'product_id' => $product2->id,
                'quantity' => 5,
            ],
        ],
    ]);

    $response->assertUnprocessable();

    // No partial sale should be saved.
    $this->assertDatabaseCount('sales', 0);
    $this->assertDatabaseCount('sale_items', 0);

    // Both products must retain their original stock.
    expect($product1->fresh()->inventory->quantity)->toBe(10);
    expect($product2->fresh()->inventory->quantity)->toBe(1);
});



test('authenticated user can retrieve a sale receipt with its items', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $product = createCheckoutProduct(10);

    $sale = Sale::create([
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    SaleItem::create([
        'sale_id' => $sale->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 150,
        'line_total' => 300,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/api/sales/{$sale->id}");

    $response->assertOk()
        ->assertJsonPath('sale.id', $sale->id)
        ->assertJsonPath('sale.payment_method', 'cash')
        ->assertJsonPath('sale.items.0.product_id', $product->id)
        ->assertJsonPath('sale.items.0.quantity', 2)
        ->assertJsonPath('sale.items.0.product.name', 'Test Product');
});

test('receipt retrieval returns 404 for a nonexistent sale', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/sales/999999');

    $response->assertNotFound();
});



test('authenticated user can retrieve sales history', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create([
        'role' => 'cashier',
    ]);

    $product = createCheckoutProduct();

    $sale = \App\Models\Sale::create([
        'user_id' => $user->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $sale->items()->create([
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 150,
        'line_total' => 300,
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/sales');

    $response->assertOk()
        ->assertJsonPath('data.0.id', $sale->id)
        ->assertJsonPath('data.0.payment_method', 'cash')
        ->assertJsonPath('data.0.total', 300);
});

test('sales history requires authentication', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->getJson('/api/sales');

    $response->assertUnauthorized();
});

test('cashier cannot retrieve another cashier receipt', function () {
    /** @var \Tests\TestCase $this */
    $cashierA = User::factory()->create([
        'role' => 'cashier',
    ]);

    $cashierB = User::factory()->create([
        'role' => 'cashier',
    ]);

    $sale = Sale::create([
        'user_id' => $cashierB->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $response = $this->actingAs($cashierA)
        ->getJson("/api/sales/{$sale->id}");

    $response->assertForbidden();
});

test('cashier sales history contains only their own sales', function () {
    /** @var \Tests\TestCase $this */
    $cashierA = User::factory()->create([
        'role' => 'cashier',
    ]);

    $cashierB = User::factory()->create([
        'role' => 'cashier',
    ]);

    $ownSale = Sale::create([
        'user_id' => $cashierA->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    Sale::create([
        'user_id' => $cashierB->id,
        'payment_method' => 'card',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $response = $this->actingAs($cashierA)
        ->getJson('/api/sales');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $ownSale->id)
        ->assertJsonPath('data.0.total', 300);
});

test('owner can retrieve sales belonging to multiple cashiers', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create([
        'role' => 'owner',
    ]);

    $cashierA = User::factory()->create([
        'role' => 'cashier',
    ]);

    $cashierB = User::factory()->create([
        'role' => 'cashier',
    ]);

    Sale::create([
        'user_id' => $cashierA->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    Sale::create([
        'user_id' => $cashierB->id,
        'payment_method' => 'card',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $response = $this->actingAs($owner)
        ->getJson('/api/sales');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});



test('sales history can be filtered by payment method', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create([
        'role' => 'owner',
    ]);

    $cashSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $response = $this->actingAs($owner)
        ->getJson('/api/sales?payment_method=cash');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $cashSale->id)
        ->assertJsonPath('data.0.payment_method', 'cash');
});


test('sales history can be filtered by date range', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create([
        'role' => 'owner',
    ]);

    $olderSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 100,
        'total' => 100,
    ]);

    $matchingSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $newerSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $olderSale->forceFill([
        'created_at' => '2026-09-28 10:00:00',
    ])->save();

    $matchingSale->forceFill([
        'created_at' => '2026-10-05 12:00:00',
    ])->save();

    $newerSale->forceFill([
        'created_at' => '2026-10-20 15:00:00',
    ])->save();

    $response = $this->actingAs($owner)
        ->getJson('/api/sales?from=2026-10-01&to=2026-10-10');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $matchingSale->id);
});



test('sales history combines payment method and date filters', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create([
        'role' => 'owner',
    ]);

    $matchingSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $wrongPaymentSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 400,
        'total' => 400,
    ]);

    $wrongDateSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $matchingSale->forceFill([
        'created_at' => '2026-10-05 12:00:00',
    ])->save();

    $wrongPaymentSale->forceFill([
        'created_at' => '2026-10-05 13:00:00',
    ])->save();

    $wrongDateSale->forceFill([
        'created_at' => '2026-10-20 12:00:00',
    ])->save();

    $response = $this->actingAs($owner)->getJson(
        '/api/sales?payment_method=cash&from=2026-10-01&to=2026-10-10'
    );

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $matchingSale->id)
        ->assertJsonPath('data.0.payment_method', 'cash');
});


test('sales history filters by payment method', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $cashSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $this->actingAs($owner)
        ->getJson('/api/sales?payment_method=cash')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $cashSale->id);
});

test('sales history filters by date range', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $outsideBefore = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 100,
        'total' => 100,
    ]);

    $matchingSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $outsideAfter = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $outsideBefore->forceFill([
        'created_at' => '2026-09-28 10:00:00',
    ])->save();

    $matchingSale->forceFill([
        'created_at' => '2026-10-05 12:00:00',
    ])->save();

    $outsideAfter->forceFill([
        'created_at' => '2026-10-20 15:00:00',
    ])->save();

    $this->actingAs($owner)
        ->getJson('/api/sales?from=2026-10-01&to=2026-10-10')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $matchingSale->id);
});

test('sales history combines payment and date filters', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $matchingSale = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    $wrongPayment = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'card',
        'subtotal' => 400,
        'total' => 400,
    ]);

    $wrongDate = Sale::create([
        'user_id' => $owner->id,
        'payment_method' => 'cash',
        'subtotal' => 500,
        'total' => 500,
    ]);

    $matchingSale->forceFill([
        'created_at' => '2026-10-05 12:00:00',
    ])->save();

    $wrongPayment->forceFill([
        'created_at' => '2026-10-05 13:00:00',
    ])->save();

    $wrongDate->forceFill([
        'created_at' => '2026-10-20 12:00:00',
    ])->save();

    $this->actingAs($owner)
        ->getJson(
            '/api/sales?payment_method=cash&from=2026-10-01&to=2026-10-10'
        )
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $matchingSale->id);
});

test('sales history rejects an invalid payment method filter', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $this->actingAs($owner)
        ->getJson('/api/sales?payment_method=bitcoin')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('payment_method');
});

test('sales history rejects invalid date formats', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $this->actingAs($owner)
        ->getJson('/api/sales?from=not-a-date')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('from');
});

test('sales history rejects a date range where the end is before the start', function () {
    /** @var \Tests\TestCase $this */
    $owner = User::factory()->create(['role' => 'owner']);

    $this->actingAs($owner)
        ->getJson('/api/sales?from=2026-10-10&to=2026-10-01')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('to');
});

test('cashier filters never expose another cashiers sales', function () {
    /** @var \Tests\TestCase $this */
    $cashierA = User::factory()->create(['role' => 'cashier']);
    $cashierB = User::factory()->create(['role' => 'cashier']);

    $ownSale = Sale::create([
        'user_id' => $cashierA->id,
        'payment_method' => 'cash',
        'subtotal' => 300,
        'total' => 300,
    ]);

    Sale::create([
        'user_id' => $cashierB->id,
        'payment_method' => 'cash',
        'subtotal' => 900,
        'total' => 900,
    ]);

    $this->actingAs($cashierA)
        ->getJson('/api/sales?payment_method=cash')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $ownSale->id);
});
