<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,card,bank_transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|distinct|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $sale = DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $saleItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::where('is_active', true)
                    ->find($item['product_id']);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => [
                            "Product ID {$item['product_id']} is inactive or unavailable.",
                        ],
                    ]);
                }

                /** @var \App\Models\Inventory $inventory */
                $inventory = $product->inventory()
                    ->lockForUpdate()
                    ->first();

                if (!$inventory) {
                    throw ValidationException::withMessages([
                        'items' => [
                            "Inventory record missing for product {$product->name}.",
                        ],
                    ]);
                }

                $quantity = $item['quantity'];

                if ($inventory->quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => [
                            "Insufficient stock for {$product->name}. Available: {$inventory->quantity}.",
                        ],
                    ]);
                }

                $unitPrice = (float) $product->sell_price;
                $lineTotal = round($unitPrice * $quantity, 2);

                $subtotal = round($subtotal + $lineTotal, 2);

                $saleItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ];

                $inventory->decrement('quantity', $quantity);
            }

            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'payment_method' => $validated['payment_method'],
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            $sale->items()->createMany($saleItems);

            return $sale->load('items.product');
        });

        return response()->json([
            'message' => 'Sale completed successfully.',
            'sale' => $sale,
        ], 201);
    }


    public function show(Sale $sale)
    {
        $sale->load(['items.product', 'user']);

        return response()->json([
            'sale' => $sale,
        ]);
    }


    public function index(Request $request)
    {
        $validated = $request->validate([
    'from' => 'sometimes|date_format:Y-m-d',
    'to' => 'sometimes|date_format:Y-m-d|after_or_equal:from',
    ]);

        $query = Sale::with('user');

        if (isset($validated['payment_method'])) {
            $query->where(
                'payment_method',
                $validated['payment_method']
            );
        }

        if (isset($validated['from'])) {
            $query->whereDate('created_at', '>=', $validated['from']);
        }

        if (isset($validated['to'])) {
            $query->whereDate('created_at', '<=', $validated['to']);
        }

        $sales = $query->latest()->paginate(15);

        return response()->json($sales);
    }

}
