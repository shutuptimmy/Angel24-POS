<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\MakeComService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    protected $makeComService;

    public function __construct(MakeComService $makeComService)
    {
        $this->makeComService = $makeComService;
    }

    public function LoadProducts()
    {
        $products = Product::with(['category'])
            ->where('tbl_products.is_deleted', false)
            ->get();

        return response()->json([
            'products' => $products
        ], 200);
    }

    public function StoreProduct(Request $request)
    {
        $validated = $request->validate([
            'product_sku'           => ['required', Rule::unique('tbl_products', 'product_sku')],
            'product_name'          => ['required', 'max: 20'],
            'product_price'         => ['required'],
            'category'              => ['required'],
            'product_image'         => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'product_stocks'        => ['required'],
            'product_min_threshold' => ['nullable'],
        ]);

        $image = null;

        if ($request->hasFile('product_image')) {
            $image = $request->file('product_image')->store('products', 'public');
        }

        $product = Product::create([
            'product_sku'           => $validated['product_sku'],
            'product_name'          => $validated['product_name'],
            'product_price'         => $validated['product_price'],
            'category_id'           => $validated['category'],
            'product_image'         => $image,
            'product_stocks'        => $validated['product_stocks'],
            'product_min_threshold' => $validated['product_min_threshold'],
        ]);
        if (!$this->makeComService->sendProductItem($product)) {
            Log::error('Failed to sync an product to Google Sheets', ['product_id' => $product->product_id]);
        }

        return response()->json([
            'message' => 'New product has been added!'
        ], 200);
    }

    public function UpdateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_sku' => ['required', Rule::unique('tbl_products', 'product_sku')->ignore($product->product_id, 'product_id')],
            'product_name'          => ['required', 'max: 20'],
            'product_price'         => ['required'],
            'category'              => ['required'],
            'product_image'         => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'product_stocks'        => ['required'],
            'product_min_threshold' => ['nullable'],
            'remove_image'          => ['boolean', 'nullable'],
        ]);

        $updateProduct = [
            'product_sku'           => $validated['product_sku'],
            'product_name'          => $validated['product_name'],
            'product_price'         => $validated['product_price'],
            'category_id'           => $validated['category'],
            'product_stocks'        => $validated['product_stocks'],
            'product_min_threshold' => $validated['product_min_threshold'],
        ];


        if ($request->hasFile('product_image')) {
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }

            $image = $request->file('product_image')->store('products', 'public');
            $updateProduct['product_image'] = $image;
        } elseif (isset($validated['remove_image']) && $validated['remove_image']) {
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }
            $updateProduct['product_image'] = null;
        }

        $product->update($updateProduct);
        if (!$this->makeComService->sendProductItem($product)) {
            Log::error('Failed to sync an product to Google Sheets', ['product_id' => $product->product_id]);
        }


        return response()->json([
            'message' => 'Product Successfully Updated.'
        ], 200);
    }

    public function DeleteProduct(Product $product)
    {
        if ($product->product_image) {
            $image = $product->product_image;

            if (Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'The product has been removed.'
        ], 200);
    }
}
