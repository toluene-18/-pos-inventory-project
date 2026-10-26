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
            $productIds = collect($validated['items'])->pluck('product_id')->all();

            // 1 batch query to fetch all products and lock their inventories
            $products = Product::where('is_active', true)
                ->whereIn('id', $productIds)
                ->with(['inventory' => fn($q) => $q->lockForUpdate()])
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            $saleItems = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => [
                            "Product ID {$item['product_id']} is inactive or unavailable.",
                        ],
                    ]);
                }

                /** @var \App\Models\Inventory $inventory */
                $inventory = $product->inventory;

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

    public function show(Request $request, Sale $sale)
    {
        $user = $request->user();

        // Cashiers can only view their own sales; managers and owners can see all sales.
        if (in_array($user->role, ['cashier'], true) && $sale->user_id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        $sale->load(['items.product', 'user']);

        return response()->json([
            'sale' => $sale,
        ]);
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'sometimes|in:cash,card,bank_transfer',
            'from' => 'sometimes|date_format:Y-m-d',
            'to' => 'sometimes|date_format:Y-m-d|after_or_equal:from',
            'per_page' => 'sometimes|integer|min:1|max:500',
            'all' => 'sometimes|boolean',
        ]);

        $query = Sale::with(['user:id,name,email', 'items.product:id,name,sku,sell_price,unit']);

        // Owners and managers can view all sales; cashiers only see their own.
        if ($request->user()->role === 'cashier') {
            $query->where('user_id', $request->user()->id);
        }

        if (isset($validated['payment_method'])) {
            $query->where('payment_method', $validated['payment_method']);
        }

        // Use index range comparison rather than whereDate to enable MySQL B-Tree index scan
        if (isset($validated['from'])) {
            $query->where('created_at', '>=', $validated['from'] . ' 00:00:00');
        }

        if (isset($validated['to'])) {
            $query->where('created_at', '<=', $validated['to'] . ' 23:59:59');
        }

        if ($request->boolean('all')) {
            $sales = $query->latest()->limit(500)->get();
            return response()->json([
                'data' => $sales,
                'total' => $sales->count(),
                'current_page' => 1,
                'last_page' => 1,
            ]);
        }

        $perPage = min((int) $request->input('per_page', 15), 500);
        $sales = $query->latest()->paginate($perPage);

        return response()->json($sales);
    }

    public function report(Request $request)
    {
        $validated = $request->validate([
            'from' => 'sometimes|required|date_format:Y-m-d',
            'to' => 'sometimes|required|date_format:Y-m-d|after_or_equal:from',
        ]);

        $query = Sale::query();

        if (isset($validated['from'])) {
            $query->where('created_at', '>=', $validated['from'] . ' 00:00:00');
        }

        if (isset($validated['to'])) {
            $query->where('created_at', '<=', $validated['to'] . ' 23:59:59');
        }

        $summary = (clone $query)
            ->selectRaw(
                'COUNT(*) as total_sales,
                COALESCE(SUM(total), 0) as total_revenue,
                COALESCE(AVG(total), 0) as average_sale_value'
            )
            ->first();

        $paymentBreakdown = (clone $query)
            ->select('payment_method')
            ->selectRaw(
                'COUNT(*) as transactions,
                COALESCE(SUM(total), 0) as revenue'
            )
            ->groupBy('payment_method')
            ->get()
            ->map(function ($entry) {
                $entry->transactions = (int) $entry->transactions;
                $entry->revenue = (float) $entry->revenue;

                return $entry;
            });

        return response()->json([
            'filters' => [
                'from' => $validated['from'] ?? null,
                'to' => $validated['to'] ?? null,
            ],
            'summary' => [
                'total_sales' => (int) $summary->total_sales,
                'total_revenue' => (float) $summary->total_revenue,
                'average_sale_value' => round(
                    (float) $summary->average_sale_value,
                    2
                ),
            ],
            'payment_breakdown' => $paymentBreakdown,
        ]);
    }

}
