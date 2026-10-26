<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockAdjustmentController extends Controller
{
    public function index()
    {
        $adjustments = StockAdjustment::with(['product:id,name,sku,unit', 'user:id,name'])
            ->latest()
            ->take(100)
            ->get();

        return response()->json($adjustments);
    }

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
            /** @var \App\Models\Inventory $inventory */
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

            /** @var \App\Models\StockAdjustment $adjustment */
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

    public function storeBulk(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.type' => 'required|in:increase,decrease',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.reason' => 'nullable|string|max:5000',
        ]);

        $userId = $request->user()->id;

        $count = DB::transaction(function () use ($validated, $userId) {
            $productIds = collect($validated['items'])->pluck('product_id')->all();
            $inventories = Inventory::whereIn('product_id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('product_id');

            $adjustments = [];

            foreach ($validated['items'] as $item) {
                $inventory = $inventories->get($item['product_id']);
                if (! $inventory) {
                    continue;
                }

                $quantity = $item['quantity'];
                if ($item['type'] === 'decrease' && $inventory->quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => ['The adjustment cannot reduce stock below zero.'],
                    ]);
                }

                $change = $item['type'] === 'increase' ? $quantity : -$quantity;
                $inventory->quantity += $change;
                $inventory->save();

                $adjustments[] = [
                    'product_id' => $item['product_id'],
                    'user_id' => $userId,
                    'type' => $item['type'],
                    'quantity_change' => $change,
                    'reason' => $item['reason'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            StockAdjustment::insert($adjustments);

            return count($adjustments);
        });

        return response()->json([
            'message' => "Successfully adjusted stock for {$count} products.",
        ], 201);
    }
}
