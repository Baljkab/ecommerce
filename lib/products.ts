import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Цагаан футболк",
    description: "Өдөр тутам өмсөх даавуун футболк.",
    price: 45000,
    imageUrl: "https://res.cloudinary.com/dok1bfadc/image/upload/v1789627320/ds6zmwov7wdhebltuwax.jpg",
    category: "Хувцас",
    size: { S: 3, M: 4, L: 2, XL: 7, XXL: 1 },
  },
  {
    id: 2,
    name: "Спорт гутал",
    description: "Хөнгөн, эвтэйхэн спорт гутал.",
    price: 120000,
    imageUrl: "https://res.cloudinary.com/dok1bfadc/image/upload/v1789627320/ds6zmwov7wdhebltuwax.jpg",
    category: "Гутал",
    size: { "38": 2, "39": 3, "40": 3, "41": 3, "42": 3 },
  },
];