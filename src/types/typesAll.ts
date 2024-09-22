// Define types for the request payload
export interface ProductRequest {
    id: number;
    quantity: number;
}

export interface OrderRequest {
    products: ProductRequest[];
}

// Define types for product data from DB
export interface ProductData {
    id: number;
    name: string;
    price: number;
    stock: number;
    sold: number;
    created_at: string;
    updated_at: string;
}

// Define the types for Order, Product
export interface Product {
    id: number;
    name: string;
    price: number;
    quantity?: number;
    stock: number;
    sold: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    products: Product[];
    created_at: string;
    updated_at: string;
}