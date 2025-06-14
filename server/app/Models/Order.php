<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'tbl_orders';
    protected $primaryKey = 'order_id';
    protected $fillable = [
        'order_number',
        'customer_name',
        'total_price',
        'total_quantity',
    ];

    protected $casts = [
        'is_senior_citizen' => 'boolean',
        'total_quantity' => 'integer',
        'customer_name' => 'encrypted',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function productOrders()
    {
        return $this->hasMany(ProductOrder::class, 'order_id', 'order_id');
    }
}
