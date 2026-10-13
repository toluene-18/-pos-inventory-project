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
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User']
        );
        $products = [
            [
                'name' => 'Coca-Cola 50cl',
                'sku' => 'CC-50',
                'category' => 'drinks',
                'cost_price' => 350,
                'sell_price' => 500,
                'quantity' => 12,
                'reorder_threshold' => 10,
            ],
            [
                'name' => 'Indomie Noodles',
                'sku' => 'IN-70',
                'category' => 'groceries',
                'cost_price' => 250,
                'sell_price' => 350,
                'quantity' => 30,
                'reorder_threshold' => 15,
            ],
        ];

        foreach ($products as $data) {
            $product = Product::updateOrCreate(
                ['sku' => $data['sku']],
                [
                    'name' => $data['name'],
                    'category' => $data['category'],
                    'cost_price' => $data['cost_price'],
                    'sell_price' => $data['sell_price'],
                ]
            );

            $product->inventory()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'quantity' => $data['quantity'],
                    'reorder_threshold' => $data['reorder_threshold'],
                ]
            );
        }
    }
}
