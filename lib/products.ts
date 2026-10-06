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

// Supabase дахь туршилтын тайлбарыг засах хүртэл ашиглах тайлбар.
// Үзүүлэлт: https://www.razer.com/ap-en/gaming-mice/razer-viper-v4-pro?page=tech-specs
const viperV4ProDescription =
  "Razer Viper V4 Pro — өрсөлдөөнт тоглоомд зориулсан хөнгөн, утасгүй хулгана. " +
  "Focus Pro 50K Gen-3 оптик мэдрэгч, 50,000 DPI хүртэлх мэдрэмж, " +
  "утастай болон утасгүй горимд 8,000 Hz хүртэлх мэдээлэл дамжуулах давтамжтай. " +
  "HyperSpeed Wireless Gen-2 холболт, Gen-4 оптик товчлуур, программчлах боломжтой " +
  "6 товчтой. Батарей нь 1,000 Hz тохиргоонд 180 цаг, 8,000 Hz тохиргоонд " +
  "45 цаг хүртэл ажиллана. Хэмжээ: 127.1 × 63.9 × 39.9 мм. RGB гэрэлтүүлэггүй.";

function getProductDescription(product: ProductRow): string {
  const name = product.name.trim().replace(/\s+/g, " ").toLowerCase();

  if (name === "razer viper v4 pro") {
    return viperV4ProDescription;
  }

  return product.description;
}

function mapProduct(
  product: ProductRow,
  category: CategoryRow | undefined,
): Product {
  return {
    id: product.id,
    name: product.name,
    description: getProductDescription(product),
    price: product.price,
    imageUrl: product.image_url,
    stock: product.stock,
    category: category?.name ?? "Ангилалгүй",
    categorySlug: category?.slug ?? "",
  };
}

export async function getCategories(): Promise<CategoryRow[]> {
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

// --- Админ самбарт зориулсан функцууд ---

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category_id: number | null;
};

export type AdminProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number | null;
  categoryName: string;
};

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const [productRows, categories] = await Promise.all([
    getProductRows(),
    getCategories(),
  ]);
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  );

  return productRows.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.image_url,
    stock: product.stock,
    categoryId: product.category_id,
    categoryName: product.category_id
      ? (categoryMap.get(product.category_id)?.name ?? "Ангилалгүй")
      : "Ангилалгүй",
  }));
}

export async function createProduct(input: ProductInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("products").insert({
    name: input.name,
    description: input.description,
    price: input.price,
    image_url: input.image_url,
    stock: input.stock,
    category_id: input.category_id,
  });

  if (error) {
    throw new Error(`Бараа нэмэхэд алдаа гарлаа: ${error.message}`);
  }
}

export async function updateProduct(
  productId: number,
  input: ProductInput,
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      description: input.description,
      price: input.price,
      image_url: input.image_url,
      stock: input.stock,
      category_id: input.category_id,
    })
    .eq("id", productId);

  if (error) {
    throw new Error(`Бараа шинэчлэхэд алдаа гарлаа: ${error.message}`);
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(`Бараа устгахад алдаа гарлаа: ${error.message}`);
  }
}

export type DashboardStats = {
  totalProducts: number;
  totalStock: number;
  outOfStockCount: number;
  totalCategories: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseClient();
  const [productCountResult, stockResult, categoryCountResult] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("stock")
        .overrideTypes<{ stock: number }[], { merge: false }>(),
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true }),
    ]);

  if (productCountResult.error) throw productCountResult.error;
  if (stockResult.error) throw stockResult.error;
  if (categoryCountResult.error) throw categoryCountResult.error;

  const stockRows = stockResult.data ?? [];

  return {
    totalProducts: productCountResult.count ?? 0,
    totalStock: stockRows.reduce((sum, row) => sum + row.stock, 0),
    outOfStockCount: stockRows.filter((row) => row.stock === 0).length,
    totalCategories: categoryCountResult.count ?? 0,
  };
}
