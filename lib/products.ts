import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Цагаан футболк",
    description: "Өдөр тутам өмсөх даавуун футболк.",
    price: 45000,
    imageUrl: "/images/white-shirt.jpg",
    category: "Хувцас",
    stock: 10,
  },
  {
    id: 2,
    name: "Спорт гутал",
    description: "Хөнгөн, эвтэйхэн спорт гутал.",
    price: 120000,
    imageUrl: "/images/shoes.jpg",
    category: "Гутал",
    stock: 5,
  },
];