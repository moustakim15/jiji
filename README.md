# The Official Bureau of Appointments 💙

A small, romantic, deliberately over-bureaucratic personal website, built
with Next.js (App Router), TypeScript, Tailwind CSS and Supabase.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + JS client, public key only)
- Deployment: Vercel

---

## 1. Install and test locally

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and fill it in (see step 2 below to get
#    the values from Supabase)
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

The site is then available at http://localhost:3000

---

## 2. Create the Supabase project

1. Go to https://supabase.com and sign in (or create an account).
2. Click **New project**.
3. Choose a name (e.g. `bureau-of-appointments`), a database password,
   and a region close to you.
4. Wait for the project to finish being created (about 1–2 minutes).
5. Go to **Project Settings > API**. There you'll find:
   - **Project URL** → put it in `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → put it in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ Never copy the **service_role key** into the project: it is
deliberately not used anywhere here.

---

## 3. Run the SQL schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Copy and paste the entire content of this project's
   `supabase/schema.sql` file.
4. Click **Run**.

This script:
- creates the `reservations`, `meeting_dates`, `questionnaire_responses` tables;
- enables Row Level Security (RLS) on each of them;
- creates the access policies (public read, public write except for the
  protected date);
- automatically inserts the **September 30, 2026** reservation under
  **Moustakim**'s name;
- adds useful indexes.

You can safely re-run this script: it uses `if not exists` and
`on conflict do nothing`.

This script also creates a public Storage bucket named **photos** — see
the next section.

---

## 3bis. Upload the homepage photo (Supabase Storage)

The homepage automatically displays whatever picture is in the
**photos** bucket — no code change, no environment variable, no
redeploy needed.

1. In the Supabase dashboard, go to **Storage**.
2. You should see a **photos** bucket (created automatically by
   `schema.sql`, marked Public). If it isn't there, create one named
   exactly `photos` and mark it **Public**.
3. Open it and click **Upload file**. Choose a picture you own the
   rights to, or one you have permission to use (see the note about
   Fairuz/Oum Kalthoum photos in `public/images/README.txt`).
4. Reload the homepage: your picture now appears, large and centered,
   inside the vintage frame.

To change the picture later, upload a new file (optionally delete the
old one first) — the site always shows the most recently uploaded file.

Only you can upload, replace, or delete files in this bucket (from the
Supabase Dashboard); the website itself only ever *reads* from it, it
never exposes an upload feature to visitors.

---

## 4. Environment variables to add in Vercel

In your Vercel project: **Settings > Environment Variables**, add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | (optional) only used as a fallback if the "photos" bucket is empty |

Apply them to the **Production**, **Preview**, and **Development**
environments.

---

## 5. Connect the GitHub repository to Vercel

1. Push this project to a GitHub repository (private, given the subject
   matter 😉):
   ```bash
   git init
   git add .
   git commit -m "The Official Bureau of Appointments"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<your-repo>.git
   git push -u origin main
   ```
2. Go to https://vercel.com, click **Add New… > Project**.
3. Import the GitHub repository created above.
4. Vercel automatically detects Next.js. Before deploying, add the
   environment variables from step 4.
5. Click **Deploy**.

---

## 6. Verify that data is really being saved to Supabase after deployment

1. Open the deployed site (the URL provided by Vercel).
2. Upload a picture to the **photos** bucket (Storage) and confirm it
   appears on the homepage.
3. Go to `/reservation`, book a test date with a name.
3. In Supabase, open **Table Editor > reservations**: the new row should
   appear.
4. Go to `/date`, choose a date, confirm it.
5. In Supabase, check the **meeting_dates** table.
6. Go to `/questionnaire`, fill it in and submit it.
7. Check the **questionnaire_responses** table.
8. Go to `/confirmation`: the official document should display the data
   fetched from Supabase (not local data).

You can also try, from a different browser or in a private window, to
book **September 30, 2026** on `/reservation`: the humorous rejection
message should appear, and no row should be created in Supabase for that
date.

---

## Security — why September 30, 2026 is really protected

Two independent protections, both at the database level (so they cannot
be bypassed by modifying the site alone):

1. A **`UNIQUE(date)` constraint** on the `reservations` table: only one
   row can exist per date.
2. An **RLS insert policy** that explicitly refuses any insert attempt on
   `2026-09-30`, regardless of who is calling.

The frontend shows a friendly message, but even a direct HTTP request to
the Supabase API (completely bypassing the interface) would be rejected
by the database itself.

---

## Project structure

```
app/
  page.tsx                  → Homepage
  reservation/page.tsx       → Register of reservations (the bureaucratic joke)
  date/page.tsx               → Real date choice, made by your girlfriend
  questionnaire/page.tsx      → Questionnaire
  confirmation/page.tsx       → "OFFICIAL APPOINTMENT ORDER" summary document
  layout.tsx, globals.css

components/
  MusicPlayer.tsx      → Vintage Spotify player, present on every page
  VintageCalendar.tsx  → Reusable calendar
  Questionnaire.tsx    → Questionnaire form
  VintageButton.tsx, PaperCard.tsx, Stamp.tsx, Header.tsx
  ReservationBoard.tsx, DateSelector.tsx

lib/supabase/
  client.ts   → Browser Supabase client (anon key only)
  server.ts   → Supabase client for Server Components

types/database.ts   → TypeScript types for the tables

supabase/schema.sql → paste this into the Supabase SQL Editor
```

---

## Known limitation — Spotify player

Spotify does not allow a public site to fully control playback of a
custom playlist unless the listener connects their own Premium account
(Web Playback API + OAuth). The solution used here is therefore the
**official Spotify Embed** — the only method Spotify allows for this use
case. It is rendered at Spotify's standard size so the full tracklist is
visible, and it handles the current track, title, artist, cover art,
play/pause and progress by itself.
