This folder is only a fallback option. The recommended way to set your
homepage photo is now Supabase Storage — see below.

About photos of Fairuz, Oum Kalthoum, or other artists:
these photographs are usually protected by copyright and/or image rights.
This project never downloads or embeds any such photo automatically.

RECOMMENDED — Upload via Supabase Storage:
1. In your Supabase project, go to Storage.
2. If the "photos" bucket doesn't already exist (it is created
   automatically when you run supabase/schema.sql), create a bucket
   named exactly "photos" and mark it Public.
3. Open the "photos" bucket and click "Upload file". Pick a picture you
   own the rights to (or one you have permission to use).
4. That's it — the homepage automatically displays the most recently
   uploaded file in that bucket. No code change, no redeploy needed.
   To change the picture later, just upload a new file (or delete the
   old one first).

ALTERNATIVE — local file or external URL:
If you'd rather not use Supabase Storage, you can still:
- place an image file in this folder and set the environment variable
  NEXT_PUBLIC_HERO_IMAGE_URL to "/images/your-file-name.jpg", or
- set NEXT_PUBLIC_HERO_IMAGE_URL to an external URL you have the right
  to display.
This is only used as a fallback if the "photos" bucket is empty.
