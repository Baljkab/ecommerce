import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

export function getSupabaseClient() {
  if (typeof window !== "undefined" && browserClient) return browserClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase тохиргоо дутуу байна. .env.local файлд NEXT_PUBLIC_SUPABASE_URL болон NEXT_PUBLIC_SUPABASE_ANON_KEY нэмнэ үү.",
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey);
  if (typeof window !== "undefined") browserClient = client;
  return client;
}
