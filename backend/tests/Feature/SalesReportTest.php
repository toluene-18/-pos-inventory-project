<?php

use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createReportSale(
    User $user,
    string $paymentMethod,
    float $total,
    string $createdAt
): Sale {
    $sale = Sale::create([
        'user_id' => $user->id,
        'payment_method' => $paymentMethod,
        'subtotal' => $total,
        'total' => $total,
    ]);

    $sale->forceFill([
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ])->save();

    return $sale;
}

function reportOwner(): User {
    return User::factory()->create(['role' => 'owner']);
}

function reportCashier(): User {
    return User::factory()->create(['role' => 'cashier']);
}

it('returns the sales summary and payment breakdown', function () {
    /** @var \Tests\TestCase $this */
    $owner = reportOwner();

    createReportSale($owner, 'cash', 100, '2026-10-10 10:00:00');
    createReportSale($owner, 'cash', 50, '2026-10-10 11:00:00');
    createReportSale($owner, 'card', 200, '2026-10-11 10:00:00');
    createReportSale($owner, 'bank_transfer', 150, '2026-10-12 10:00:00');

    $response = $this->actingAs($owner)->getJson('/api/reports/sales');

    $response->assertOk()
        ->assertJsonPath('summary.total_sales', 4)
        ->assertJsonPath('summary.total_revenue', 500)
        ->assertJsonPath('summary.average_sale_value', 125);

    $breakdown = collect($response->json('payment_breakdown'))
        ->keyBy('payment_method');

    expect((float) $breakdown['cash']['revenue'])->toBe(150.0)
        ->and((int) $breakdown['cash']['transactions'])->toBe(2)
        ->and((float) $breakdown['card']['revenue'])->toBe(200.0)
        ->and((float) $breakdown['bank_transfer']['revenue'])->toBe(150.0);
});

it('filters the report by date range', function () {
    /** @var \Tests\TestCase $this */
    $owner = reportOwner();

    createReportSale($owner, 'cash', 100, '2026-10-01 12:00:00');
    createReportSale($owner, 'card', 200, '2026-10-15 12:00:00');
    createReportSale($owner, 'cash', 300, '2026-10-20 12:00:00');

    $response = $this->actingAs($owner)->getJson(
        '/api/reports/sales?from=2026-10-10&to=2026-10-18'
    );

    $response->assertOk()
        ->assertJsonPath('summary.total_sales', 1)
        ->assertJsonPath('summary.total_revenue', 200)
        ->assertJsonPath('summary.average_sale_value', 200)
        ->assertJsonPath('filters.from', '2026-10-10')
        ->assertJsonPath('filters.to', '2026-10-18');
});

it('returns zero totals when no sales match the date range', function () {
    /** @var \Tests\TestCase $this */
    $owner = reportOwner();

    $response = $this->actingAs($owner)->getJson(
        '/api/reports/sales?from=2026-10-10&to=2026-10-12'
    );

    $response->assertOk()
        ->assertJsonPath('summary.total_sales', 0)
        ->assertJsonPath('summary.total_revenue', 0)
        ->assertJsonPath('summary.average_sale_value', 0)
        ->assertJsonPath('payment_breakdown', []);
});

it('rejects an invalid date format', function () {
    /** @var \Tests\TestCase $this */
    $owner = reportOwner();

    $this->actingAs($owner)
        ->getJson('/api/reports/sales?from=10-10-2026')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('from');
});

it('rejects a date range where the end is before the start', function () {
    /** @var \Tests\TestCase $this */
    $owner = reportOwner();

    $this->actingAs($owner)
        ->getJson('/api/reports/sales?from=2026-10-18&to=2026-10-10')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('to');
});

it('forbids cashiers from viewing store-wide reports', function () {
    /** @var \Tests\TestCase $this */
    $cashier = reportCashier();

    $this->actingAs($cashier)
        ->getJson('/api/reports/sales')
        ->assertForbidden();
});

it('requires authentication to view sales reports', function () {
    /** @var \Tests\TestCase $this */
    $this->getJson('/api/reports/sales')
        ->assertUnauthorized();
});
