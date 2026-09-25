<?php

namespace Database\Seeders;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Product::create([
            'name' => 'Coca-Cola 50cl',
            'sku' => 'CC-50',
            'category' => 'drinks',
            'cost_price' => 350,
            'sell_price' => 500,
            'current_stock' => 12,
            'reorder_threshold' => 10,
        ]);

        Product::create([
            'name' => 'Indomie Noodles',
            'sku' => 'IN-70',
            'category' => 'groceries',
            'cost_price' => 250,
            'sell_price' => 350,
            'current_stock' => 30,
            'reorder_threshold' => 15,
        ]);
    }
}
