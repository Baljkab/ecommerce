export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
};

export type CartItemData = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
};