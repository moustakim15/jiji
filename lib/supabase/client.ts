"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Log instead of crashing the whole build: useful in dev if
  // .env.local hasn't been filled in yet.
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Client using ONLY the public "anon" key. Never the service_role key
// here: this file ends up in the bundle sent to the browser.
//
// Note: we don't pass the <Database> generic type to the Supabase client
// (the precise types are defined by hand in types/database.ts and used
// directly in components) to stay simply compatible across Supabase
// client versions without extra configuration — the simplest, most
// reliable approach for a small project like this one.
export const supabaseBrowser = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);
