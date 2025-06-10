export interface LocalCartItem {
    localId: string;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    discount_percentage: number;
    subtotal_price: number;
}