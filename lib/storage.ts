import { getSupabaseServerClient } from "@/lib/supabase/server";

export const PHOTOS_BUCKET = "photos";

/**
 * Looks directly inside the root of the "photos" Supabase Storage
 * bucket (no subfolders) for the most recently uploaded file whose name
 * starts with the given prefix, and returns its public URL — or null if
 * none is found.
 *
 * This lets you upload every picture straight into the bucket: just
 * name the file starting with "hero" for the homepage photo (e.g.
 * "hero.jpg", "hero-2026.png") or "background" for the site-wide
 * background (e.g. "background.jfif").
 */
export async function getPhotoUrlByPrefix(prefix: string): Promise<string | null> {
  const supabase = getSupabaseServerClient();

  const { data: files, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .list("", { limit: 100 });

  if (error || !files || files.length === 0) {
    return null;
  }

  const matches = files.filter((f) =>
    f.name.toLowerCase().startsWith(prefix.toLowerCase())
  );
  if (matches.length === 0) return null;

  // Sort matches by creation date ourselves (most recent first) instead
  // of relying on the Storage API's sortBy option, which isn't always
  // reliable — this guarantees that, if several files share the same
  // prefix (e.g. an old test file and a newly uploaded one), the most
  // recently uploaded one always wins.
  matches.sort((a, b) => {
    const dateA = new Date(a.created_at ?? 0).getTime();
    const dateB = new Date(b.created_at ?? 0).getTime();
    return dateB - dateA;
  });

  const file = matches[0];
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(file.name);
  return data.publicUrl;
}