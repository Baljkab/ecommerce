import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase тохиргоо дутуу байна. .env.local файлд NEXT_PUBLIC_SUPABASE_URL болон NEXT_PUBLIC_SUPABASE_ANON_KEY нэмнэ үү.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
