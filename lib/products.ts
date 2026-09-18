import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "ASUS VivoBook 15",
    description:
      "Intel Core i5 процессор, 16GB RAM, 512GB SSD бүхий зөөврийн компьютер.",
    price: 2_350_000,
    imageUrl:
      "https://res.cloudinary.com/dok1bfadc/image/upload/v1789700683/bpxeg3iktjziry9hziqq.jpg",
    category: "Зөөврийн компьютер",
  },
  {
    id: 2,
    name: "Gaming Computer",
    description:
      "Intel Core i7 процессор, RTX 4060 график карт, 16GB RAM бүхий тоглоомын компьютер.",
    price: 4_500_000,
    imageUrl:
      "https://res.cloudinary.com/dok1bfadc/image/upload/v1789702399/pfuaauogaisjerxvxgcd.jpg",
    category: "Суурин компьютер",
  },
];