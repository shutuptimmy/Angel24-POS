import type { ProductOrderItem } from '../product/ProductOrderItem';

export interface Order {
    order_id: number;
    customer_name: string | null;
    order_number: string;
    total_price: number;
    total_quantity: number;
    created_at: string;
    updated_at: string;
    is_senior_citizen?: boolean;
    product_orders?: ProductOrderItem[];
}