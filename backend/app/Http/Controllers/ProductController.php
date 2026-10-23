<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function webIndex()
    {
        $products = Product::with('inventory')->get();

        return view('product.index', compact('products'));
    }

    public function index(Request $request)
    {
        $products = Product::with('inventory')
            ->where('is_active', true)
            ->get();

        // Cost price reveals margins — owners and managers only.
        if (! in_array($request->user()?->role, ['owner', 'manager'], true)) {
            $products->each->makeHidden('cost_price');
        }

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku',
            'category' => 'required|string|max:255',
            'unit' => 'nullable|string|max:50',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'image_path' => 'nullable|string|max:1000',
            'current_stock' => 'required|integer|min:0',
            'reorder_threshold' => 'required|integer|min:0',
        ]);

        $product = DB::transaction(function () use ($validated) {
            $product = Product::create([
                'name' => $validated['name'],
                'sku' => $validated['sku'],
                'category' => $validated['category'],
                'unit' => $validated['unit'] ?? 'piece',
                'cost_price' => $validated['cost_price'],
                'sell_price' => $validated['sell_price'],
                'image_path' => $validated['image_path'] ?? null,
            ]);

            $product->inventory()->create([
                'quantity' => $validated['current_stock'],
                'reorder_threshold' => $validated['reorder_threshold'],
            ]);

            return $product->load('inventory');
        });

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sku' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'unique:products,sku,' . $product->id,
            ],
            'category' => 'sometimes|required|string|max:255',
            'unit' => 'nullable|string|max:50',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'sell_price' => 'sometimes|required|numeric|min:0',
            'image_path' => 'nullable|string|max:1000',
            'current_stock' => 'nullable|integer|min:0',
            'reorder_threshold' => 'nullable|integer|min:0',
        ]);

        $product->update($validated);

        if ($request->has('current_stock') || $request->has('reorder_threshold')) {
            $invUpdates = [];
            if ($request->has('current_stock')) {
                $invUpdates['quantity'] = (int) $request->input('current_stock');
            }
            if ($request->has('reorder_threshold')) {
                $invUpdates['reorder_threshold'] = (int) $request->input('reorder_threshold');
            }
            if ($product->inventory) {
                $product->inventory->update($invUpdates);
            } else {
                $product->inventory()->create($invUpdates);
            }
        }

        return response()->json(
            $product->fresh()->load('inventory'),
            200
        );
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $path = $request->file('image')->store('products', 'public');

        return response()->json([
            'url' => '/storage/' . $path,
            'message' => 'Image uploaded successfully.',
        ], 201);
    }

    public function delete(Product $product)
    {
        $product->update([
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Product deactivated successfully.',
            'product' => $product->fresh()->load('inventory'),
        ], 200);
    }
}
