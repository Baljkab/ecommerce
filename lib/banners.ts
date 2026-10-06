import { getSupabaseClient } from "@/lib/supabase";

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  sortOrder: number;
};

type BannerRow = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  href: string;
  sort_order: number;
};

function mapBanner(row: BannerRow): Banner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    href: row.href,
    sortOrder: row.sort_order,
  };
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_url, href, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    // "banners" хүснэгт DB дээр хараахан үүсээгүй байж болно (migration
    // ажиллуулаагүй) — энэ үед нүүр хуудас ангиллын бараагаар fallback
    // хийх ёстой тул build/render-ийг эвдэхгүйгээр хоосон жагсаалт буцаана.
    if (error.code === "PGRST205") {
      return [];
    }
    throw new Error(`Баннер татахад алдаа гарлаа: ${error.message}`);
  }

  return (data ?? []).map(mapBanner);
}

export type BannerInput = {
  title: string;
  subtitle: string;
  image_url: string;
  href: string;
  sort_order: number;
};

export async function createBanner(input: BannerInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("banners").insert(input);

  if (error) {
    throw new Error(`Баннер нэмэхэд алдаа гарлаа: ${error.message}`);
  }
}

export async function updateBanner(
  bannerId: number,
  input: BannerInput,
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("banners")
    .update(input)
    .eq("id", bannerId);

  if (error) {
    throw new Error(`Баннер шинэчлэхэд алдаа гарлаа: ${error.message}`);
  }
}

export async function deleteBanner(bannerId: number): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", bannerId);

  if (error) {
    throw new Error(`Баннер устгахад алдаа гарлаа: ${error.message}`);
  }
}
