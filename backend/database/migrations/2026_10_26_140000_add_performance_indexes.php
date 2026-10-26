<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->index('created_at', 'sales_created_at_idx');
            $table->index(['created_at', 'payment_method'], 'sales_created_payment_idx');
            $table->index(['user_id', 'created_at'], 'sales_user_created_idx');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active', 'category'], 'products_active_category_idx');
            $table->index(['is_active', 'name'], 'products_active_name_idx');
        });

        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->index(['product_id', 'created_at'], 'stock_adj_product_created_idx');
            $table->index(['user_id', 'created_at'], 'stock_adj_user_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex('sales_created_at_idx');
            $table->dropIndex('sales_created_payment_idx');
            $table->dropIndex('sales_user_created_idx');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_active_category_idx');
            $table->dropIndex('products_active_name_idx');
        });

        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->dropIndex('stock_adj_product_created_idx');
            $table->dropIndex('stock_adj_user_created_idx');
        });
    }
};
