<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockAdjustmentController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type' => 'required|in:increase,decrease',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:5000',
        ]);

        $result = DB::transaction(function () use (
            $request,
            $product,
            $validated
        ) {
            $inventory = $product->inventory()
                ->lockForUpdate()
                ->firstOrFail();

            $quantity = $validated['quantity'];

            if (
                $validated['type'] === 'decrease'
                && $inventory->quantity < $quantity
            ) {
                throw ValidationException::withMessages([
                    'quantity' => [
                        'The adjustment cannot reduce stock below zero.',
                    ],
                ]);
            }

            $quantityChange = $validated['type'] === 'increase'
                ? $quantity
                : -$quantity;

            $inventory->quantity += $quantityChange;
            $inventory->save();

            $adjustment = StockAdjustment::create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'type' => $validated['type'],
                'quantity_change' => $quantityChange,
                'reason' => $validated['reason'] ?? null,
            ]);

            return [
                'inventory' => $inventory->fresh(),
                'adjustment' => $adjustment,
            ];
        });

        return response()->json([
            'message' => 'Stock adjusted successfully.',
            'inventory' => $result['inventory'],
            'adjustment' => $result['adjustment'],
        ], 201);
    }
}
