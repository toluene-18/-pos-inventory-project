<?php

namespace App\Models;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\Request;

class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'category',
        'unit',
        'cost_price',
        'sell_price',
        'image_path',
        'is_active',
    ];


    public function hideCost(?User $user = null): self
    {
        if (! in_array($user?->role, ['owner', 'manager'], true)) {
            $this->makeHidden('cost_price');
        }

        return $this;
    }




    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }
}
