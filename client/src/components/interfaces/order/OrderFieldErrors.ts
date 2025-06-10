export interface OrderFieldErrors {
    customer_name?: string[]; // Array of error messages for customer_name
    products?: string[];      // Array of error messages for the whole products array
}