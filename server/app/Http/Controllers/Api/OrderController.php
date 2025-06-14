<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function LoadOrders()
    {
        $orders = Order::all();
        $isAuthenticated = Auth::check();

        // If not authenticated, redact sensitive data from each order
        if (!$isAuthenticated) {
            $orders->each(function ($order) {
                $order->customer_name = '[Redacted]';
                $order->total_price = 0;
            });
        }

        return response()->json([
            'orders' => $orders
        ], 200);
    }

    public function GetOrder($orderId)
    {
        $order = Order::with('productOrders')->find($orderId);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found.'
            ], 404);
        }

        $isAuthenticated = Auth::check();

        // If not authenticated, redact sensitive data from the single order
        if (!$isAuthenticated) {
            $order->customer_name = '[Redacted]';
            $order->total_price = 0;
        }

        return response()->json([
            'order' => $order
        ], 200);
    }


    public function StoreOrder(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => ['nullable', 'string', 'max:255'],
            'is_senior_citizen' => ['nullable', 'boolean'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.product_id' => ['required', 'integer', 'exists:tbl_products,product_id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                "customer_name" => $validated['customer_name'] ?? 'Walk-in Customer',
                'order_number' => 'Angels24Order' . uniqid(),
                'total_price' => 0,
                'total_quantity' => 0,
            ]);

            // senior citizen discount
            $applySeniorDiscount = $validated['is_senior_citizen'] ?? false;
            $seniorDiscountRate = 10;

            foreach ($validated['products'] as $productItem) {
                $productData = Product::find($productItem['product_id']);

                if (empty($productData)) {
                    DB::rollBack();
                    return response()->json(['message' => 'Product not found: ' . $productItem['product_id']], 404);
                }

                if ($productData->product_stocks < $productItem['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => $productData->product_name . ' is out of stock!'
                    ], 400);
                }

                $unitPrice = $productData->product_price;
                $quantity = $productItem['quantity'];
                $userDiscountPercentage = $productItem['discount_percentage'] ?? 0;

                $effectiveDiscountPercentage = $userDiscountPercentage;
                if ($applySeniorDiscount) {
                    $effectiveDiscountPercentage += $seniorDiscountRate;
                }
                if ($effectiveDiscountPercentage > 100) {
                    $effectiveDiscountPercentage = 100;
                }

                $itemSubtotal = $unitPrice * $quantity;
                if ($effectiveDiscountPercentage > 0) {
                    $itemSubtotal -= ($itemSubtotal * $effectiveDiscountPercentage / 100);
                }

                // Ensure subtotal doesn't go negative due to rounding or extreme discounts
                $itemSubtotal = max(0, $itemSubtotal);

                ProductOrder::create([
                    'order_id' => $order->order_id,
                    'product_id' => $productData->product_id,
                    'product_name' => $productData->product_name,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'discount_percentage' => $effectiveDiscountPercentage, // Store the combined effective discount
                    'subtotal_price' => $itemSubtotal,
                ]);

                $productData->product_stocks -= $quantity;
                $productData->save();

                $order->total_price += $itemSubtotal;
                $order->total_quantity += $quantity;
            }

            $order->save();
            DB::commit();

            return response()->json([
                'message' => 'Order Successfully Created.',
                'order_id' => $order->order_id,
                'order_number' => $order->order_number,
                'total_price' => $order->total_price,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Order creation failed: " . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'An internal server error occurred while processing your order.',
            ], 500);
        }
    }
}
