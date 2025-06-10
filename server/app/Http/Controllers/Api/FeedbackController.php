<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function LoadFeedbacks()
    {
        $feedbacks = Feedback::orderBy('created_at', 'desc')->get();
        return response()->json([
            'feedbacks' => $feedbacks
        ], 200);
    }

    public function StoreFeedback(Request $request)
    {

        $validated = $request->validate([
            'email' => ['nullable', 'email'],
            'message' => ['nullable'],
            'rating' => ['required', 'min:1', 'max:5'],
        ]);

        $feedbackData = [
            'email' => $validated['email'] ?? null,
            'message' => $validated['message'],
            'rating' => $validated['rating'],
        ];

        Feedback::create($feedbackData);

        if (!empty($validated['email'])) {
            $makePayload = [
                'email' => $validated['email'],
                'message' => $validated['message'] ?? '',
                'rating' => $validated['rating'],
            ];

            $response = Http::post('https://hook.eu2.make.com/roauny4m5wj942f1878p8k7u8dofnz8t', $makePayload);

            // Log if the webhook fails, but still return success if DB save worked
            if (!$response->successful()) {
                Log::warning("Make.com webhook failed for feedback (email provided): " . $response->body(), ['payload' => $makePayload, 'status' => $response->status()]);
            }

            return response()->json([
                'message' => $response->successful() ? 'Your feedback has been saved and sent.' : 'Your feedback has been saved, but failed to send email confirmation.',
                'success' => true
            ], 200);
        } else {
            // If no email
            return response()->json([
                'message' => 'Your feedback has been saved.',
                'success' => true
            ], 200);
        }
    }
}
