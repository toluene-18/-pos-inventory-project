<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'category',
        'cost_price',
        'sell_price',
        'current_stock',
        'reorder_threshold',
        'image_path',
    ];
}
