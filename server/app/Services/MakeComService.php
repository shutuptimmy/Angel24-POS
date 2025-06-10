<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MakeComService
{
    protected $webhookUrl;

    public function __construct()
    {
        $this->webhookUrl = config('services.make_com');

        if (empty($this->webhookUrl)) {
            Log::error('Make.com webhook URL is not configured in .env file');
        }
    }

    public function sendProductItem($product)
    {
        if (empty($this->webhookUrl)) {
            Log::error('Make.com integration failed: No webhook URL configured');
            return false;
        }

        try {
            $response = Http::timeout(15)->post($this->webhookUrl, [
                'event_type' => isset($product->wasRecentlyCreated) ? 'product_created' : 'product_updated',
                'product_id' => $product->product_id,
                'product_sku' => $product->product_sku,
                'product_name' => $product->product_name,
                'product_price' => $product->product_price,
                'product_stocks' => $product->product_stocks,
                'product_min_threshold' => $product->product_min_threshold,
                'created_at' => $product->created_at->toDateTimeString(),
                'updated_at' => $product->updated_at->toDateTimeString(),
            ]);

            if ($response->successful()) {
                Log::info('Make.com webhook successfully triggered', ['product_id' => $product->product_id]);
                return true;
            }

            Log::error('Make.com webhook failed', [
                'status' => $response->status(),
                'response' => $response->body(),
                'product_id' => $product->product_id
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Make.com integration error: ' . $e->getMessage(), [
                'product_id' => $product->product_id,
                'exception' => $e
            ]);
            return false;
        }
    }
}
