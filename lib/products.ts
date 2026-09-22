import { getSupabaseClient } from "@/lib/supabase";
import type { Product } from "@/types/product";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
};

type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category_id: number | null;
};

export type Category = CategoryRow;

function mapProduct(
  product: ProductRow,
  category: CategoryRow | undefined,
): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.image_url,
    stock: product.stock,
    category: category?.name ?? "Ангилалгүй",
    categorySlug: category?.slug ?? "",
  };
}

async function getCategories(): Promise<CategoryRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Ангилал татахад алдаа гарлаа: ${error.message}`);
  }

  return data ?? [];
}

async function getProductRows(): Promise<ProductRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, stock, category_id")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Бүтээгдэхүүн татахад алдаа гарлаа: ${error.message}`,
    );
  }

  return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const [productRows, categories] = await Promise.all([
    getProductRows(),
    getCategories(),
  ]);
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  );

  return productRows.map((product) =>
    mapProduct(product, product.category_id
      ? categoryMap.get(product.category_id)
      : undefined),
  );
}

export async function getProductById(
  productId: number,
): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === productId) ?? null;
}

export async function getProductsByCategorySlug(
  slug: string,
): Promise<{ category: Category; products: Product[] } | null> {
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return null;
  }

  const products = (await getProductRows())
    .filter((product) => product.category_id === category.id)
    .map((product) => mapProduct(product, category));

  return { category, products };
}
