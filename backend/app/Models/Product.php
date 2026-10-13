<?php

namespace App\Models;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'category',
        'cost_price',
        'sell_price',
        'image_path',
        'is_active',
    ];

    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }
}
