<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function LoadProducts()
    {
        $products = Product::where('tbl_products.is_deleted', false)->get();
        return response()->json([
            'products' => $products
        ], 200);
    }

    public function StoreProduct(Request $request)
    {
        $validated = $request->validate([
            'product_name'          => ['required', 'max: 20'],
            'product_price'         => ['required'],
            'product_stocks'        => ['required'],
            'product_min_threshold' => ['nullable'],
            'product_sku'           => ['required', Rule::unique('tbl_products', 'product_sku')]
        ]);

        Product::create([
            'product_name'          => $validated['product_name'],
            'product_price'         => $validated['product_price'],
            'product_stocks'        => $validated['product_stocks'],
            'product_min_threshold' => $validated['product_min_threshold'],
            'product_sku'           => $validated['product_sku']
        ]);

        return response()->json([
            'message' => 'New product has been added!'
        ], 200);
    }

    public function UpdateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_name'          => ['required', 'max: 20'],
            'product_price'         => ['required'],
            'product_stocks'        => ['required'],
            'product_min_threshold' => ['nullable'],
            'product_sku' => ['required', Rule::unique('tbl_products', 'product_sku')->ignore($product)],
        ]);

        $product->update([
            'product_name'          => $validated['product_name'],
            'product_price'         => $validated['product_price'],
            'product_stocks'        => $validated['product_stocks'],
            'product_min_threshold' => $validated['product_min_threshold'],
            'product_sku'           => $validated['product_sku']
        ]);

        return response()->json([
            'message' => 'Product Successfully Updated.'
        ], 200);
    }

    public function DeleteProduct(Product $product)
    {
        $product->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'The product has been removed.'
        ], 200);
    }
}
