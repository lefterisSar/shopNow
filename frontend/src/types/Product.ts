export interface Product {
    id: string; // UUID in string format
    name: string;
    category: string;
    description?: string;
    price: number;
    stock: number;
}