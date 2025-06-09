import type { Categories } from "../category/Categories";

export interface Products {
    product_id: number;
    product_sku: string;
    product_name: string;
    category: Categories;
    product_price: number;
    product_image: string | null;
    product_stocks: number;
    product_min_threshold: number;
    created_at: string;
    updated_at: string;
}