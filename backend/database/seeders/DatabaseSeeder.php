<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockAdjustment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Staff Users
        User::updateOrCreate(
            ['email' => 'owner@example.com'],
            [
                'name' => 'Chinedu Okafor',
                'password' => 'password',
                'role' => 'owner',
                'status' => 'active',
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Aisha Bello',
                'password' => 'password',
                'role' => 'manager',
                'status' => 'active',
            ]
        );

        User::updateOrCreate(
            ['email' => 'cashier@example.com'],
            [
                'name' => 'Test Cashier',
                'password' => 'password',
                'role' => 'cashier',
                'status' => 'active',
            ]
        );

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'role' => 'cashier',
                'status' => 'active',
            ]
        );

        // 2. Remove all existing products, inventories, sale items, and adjustments cleanly
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        SaleItem::truncate();
        Sale::truncate();
        StockAdjustment::truncate();
        Inventory::truncate();
        Product::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 3. Exactly 14 Realistic Retail Products with Correct Units, Images & Stock
        $products = [
            [
                'name' => 'Nestlé Milo Energy Food Drink 500g',
                'sku' => 'NES-MILO-500',
                'category' => 'beverages',
                'unit' => 'tin',
                'cost_price' => 3800.00,
                'sell_price' => 4500.00,
                'image_path' => '/storage/products/nes-milo-500.svg',
                'quantity' => 45,
                'reorder_threshold' => 10,
            ],
            [
                'name' => 'Dano Full Cream Milk Powder 800g',
                'sku' => 'DAN-MLK-800',
                'category' => 'dairy_breakfast',
                'unit' => 'pack',
                'cost_price' => 5200.00,
                'sell_price' => 6200.00,
                'image_path' => '/storage/products/dan-mlk-800.svg',
                'quantity' => 30,
                'reorder_threshold' => 8,
            ],
            [
                'name' => 'Golden Morn Whole Grain Cereal 900g',
                'sku' => 'GLD-MRN-900',
                'category' => 'dairy_breakfast',
                'unit' => 'pack',
                'cost_price' => 3100.00,
                'sell_price' => 3800.00,
                'image_path' => '/storage/products/gld-mrn-900.svg',
                'quantity' => 50,
                'reorder_threshold' => 15,
            ],
            [
                'name' => 'Indomie Instant Noodles Onion Chicken (Carton 40x70g)',
                'sku' => 'IND-ONC-CTN',
                'category' => 'groceries',
                'unit' => 'carton',
                'cost_price' => 11500.00,
                'sell_price' => 13500.00,
                'image_path' => '/storage/products/ind-onc-ctn.svg',
                'quantity' => 25,
                'reorder_threshold' => 5,
            ],
            [
                'name' => 'Coca-Cola Original Taste 50cl PET Bottle',
                'sku' => 'COK-50-PET',
                'category' => 'beverages',
                'unit' => 'bottle',
                'cost_price' => 350.00,
                'sell_price' => 450.00,
                'image_path' => '/storage/products/cok-50-pet.svg',
                'quantity' => 120,
                'reorder_threshold' => 24,
            ],
            [
                'name' => 'Peak Evaporated Milk Tin 160g',
                'sku' => 'PEK-EVAP-160',
                'category' => 'dairy_breakfast',
                'unit' => 'tin',
                'cost_price' => 600.00,
                'sell_price' => 750.00,
                'image_path' => '/storage/products/pek-evap-160.svg',
                'quantity' => 80,
                'reorder_threshold' => 20,
            ],
            [
                'name' => 'Mama Gold Thai Parboiled Rice 50kg Bag',
                'sku' => 'MAM-RIC-50K',
                'category' => 'groceries',
                'unit' => 'bag',
                'cost_price' => 76000.00,
                'sell_price' => 85000.00,
                'image_path' => '/storage/products/mam-ric-50k.svg',
                'quantity' => 18,
                'reorder_threshold' => 5,
            ],
            [
                'name' => "Devon King's Pure Cooking Oil 5L Flagon",
                'sku' => 'DEV-OIL-5L',
                'category' => 'groceries',
                'unit' => 'bottle',
                'cost_price' => 14200.00,
                'sell_price' => 16500.00,
                'image_path' => '/storage/products/dev-oil-5l.svg',
                'quantity' => 22,
                'reorder_threshold' => 6,
            ],
            [
                'name' => 'Pringles Original Potato Crisps 165g Canister',
                'sku' => 'PRG-ORIG-165',
                'category' => 'snacks',
                'unit' => 'tin',
                'cost_price' => 2200.00,
                'sell_price' => 2800.00,
                'image_path' => '/storage/products/prg-orig-165.svg',
                'quantity' => 35,
                'reorder_threshold' => 10,
            ],
            [
                'name' => 'Minimie Chinchin Regular 45g (Roll of 12 Packs)',
                'sku' => 'MIN-CHN-R12',
                'category' => 'snacks',
                'unit' => 'pack',
                'cost_price' => 1200.00,
                'sell_price' => 1500.00,
                'image_path' => '/storage/products/min-chn-r12.svg',
                'quantity' => 40,
                'reorder_threshold' => 12,
            ],
            [
                'name' => 'Sunlight 2in1 Detergent Washing Powder 900g Pouch',
                'sku' => 'SUN-DET-900',
                'category' => 'household',
                'unit' => 'pack',
                'cost_price' => 1650.00,
                'sell_price' => 2100.00,
                'image_path' => '/storage/products/sun-det-900.svg',
                'quantity' => 60,
                'reorder_threshold' => 15,
            ],
            [
                'name' => 'Morning Fresh Super Concentrated Dishwash 1L',
                'sku' => 'MRN-FSH-1L',
                'category' => 'household',
                'unit' => 'bottle',
                'cost_price' => 2100.00,
                'sell_price' => 2600.00,
                'image_path' => '/storage/products/mrn-fsh-1l.svg',
                'quantity' => 28,
                'reorder_threshold' => 8,
            ],
            [
                'name' => 'Oral-B Pro-Health Toothpaste Extra Fresh 140g',
                'sku' => 'ORL-PRH-140',
                'category' => 'personal_care',
                'unit' => 'piece',
                'cost_price' => 1350.00,
                'sell_price' => 1750.00,
                'image_path' => '/storage/products/orl-prh-140.svg',
                'quantity' => 45,
                'reorder_threshold' => 10,
            ],
            [
                'name' => 'Dettol Antiseptic Disinfectant Liquid 500ml',
                'sku' => 'DET-ANT-500',
                'category' => 'personal_care',
                'unit' => 'bottle',
                'cost_price' => 2700.00,
                'sell_price' => 3300.00,
                'image_path' => '/storage/products/det-ant-500.svg',
                'quantity' => 32,
                'reorder_threshold' => 8,
            ],
        ];

        foreach ($products as $data) {
            $product = Product::create([
                'name' => $data['name'],
                'sku' => $data['sku'],
                'category' => $data['category'],
                'unit' => $data['unit'],
                'cost_price' => $data['cost_price'],
                'sell_price' => $data['sell_price'],
                'image_path' => $data['image_path'],
                'is_active' => true,
            ]);

            $product->inventory()->create([
                'quantity' => $data['quantity'],
                'reorder_threshold' => $data['reorder_threshold'],
            ]);
        }
    }
}
