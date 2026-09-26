import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client for Server Components and Server Actions.
 *
 * This site has no authentication system (no user accounts): protecting
 * September 30, 2026 does not rely on "who is logged in" but on the Row
 * Level Security rules and the UNIQUE constraint defined in
 * supabase/schema.sql, which apply to everyone, including through this
 * client.
 *
 * We deliberately use the public "anon" key here too (never the
 * service_role key): the real security comes from the database itself,
 * not from a server-side secret.
 */
export function getSupabaseServerClient() {
  return createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
    auth: { persistSession: false },
  });
}
