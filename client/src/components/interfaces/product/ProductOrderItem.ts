export interface ProductOrderItem {
    product_order_id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    unit_price: number; 
    quantity: number;
    discount_percentage: number;
    subtotal_price: number;
    created_at: string;
    updated_at: string;
}