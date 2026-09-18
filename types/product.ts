export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    size?: Record<string, number>;
};