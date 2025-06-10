export interface StoreOrderPayload {
    customer_name: string;
    products: {
        product_id: number;
        quantity: number;
        discount_percentage?: number; 
    }[]; 
    is_senior_citizen?: boolean;
}