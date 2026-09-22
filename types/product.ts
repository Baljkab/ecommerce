export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    categorySlug: string;
    stock: number;
};

export type CartItemData = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    stock: number;
};