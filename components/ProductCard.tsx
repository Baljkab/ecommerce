import type { Product } from "@/types/product";

type ProductCardProps = {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps) {
    return (
        <article>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Үнэ: {product.price}</p>
        </article>
    )
}