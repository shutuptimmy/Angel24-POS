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
        Schema::create('tbl_products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('product_sku')->unique();
            $table->string('product_name', 55);
            $table->unsignedBigInteger('category_id');
            $table->float('product_price', 8, 2);
            $table->string('product_image')->nullable();
            $table->integer('product_stocks');
            $table->integer('product_min_threshold')->nullable();
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('category_id')
                ->references('category_id')
                ->on('tbl_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_products');
        Schema::enableForeignKeyConstraints();
    }
};
