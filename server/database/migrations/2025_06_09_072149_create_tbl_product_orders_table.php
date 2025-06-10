<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_product_orders', function (Blueprint $table) {
            $table->id('product_order_id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id');

            $table->string('product_name');
            $table->float('unit_price', 8, 2);
            $table->integer('quantity');
            $table->float('discount_percentage', 5, 2);
            $table->float('subtotal_price', 8, 2);
            $table->timestamps();

            $table->foreign('order_id')
                ->references('order_id')
                ->on('tbl_orders')
                ->onDelete('cascade');

            $table->foreign('product_id')
                ->references('product_id')
                ->on('tbl_products')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_product_orders');
    }
};
