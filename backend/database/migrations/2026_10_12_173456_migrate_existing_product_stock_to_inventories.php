
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $products = DB::table('products')->get();

        foreach ($products as $product) {
            DB::table('inventories')->insertOrIgnore([
                'product_id' => $product->id,
                'quantity' => $product->current_stock,
                'reorder_threshold' => $product->reorder_threshold,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('inventories')->delete();
    }
};
