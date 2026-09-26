-- =========================================================================
--  THE OFFICIAL BUREAU OF APPOINTMENTS — Supabase Schema (PostgreSQL)
-- =========================================================================
--  Copy this entire script into Supabase > SQL Editor > New query, then
--  click "Run". The script is safe to re-run (it uses IF NOT EXISTS /
--  ON CONFLICT DO NOTHING wherever relevant).
-- =========================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. TABLE reservations
--    The "official system" of appointment booking (the bureaucratic joke).
--    September 30, 2026 is reserved for "Moustakim" and nobody else can
--    book that date — neither from the frontend nor via a direct API
--    request (RLS + UNIQUE constraint = defense in depth).
-- -------------------------------------------------------------------------
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  reserved_by text not null check (char_length(trim(reserved_by)) > 0),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamptz not null default now(),

  -- Only one reservation per date: this is what prevents, at the
  -- database level, anyone else from "stealing" September 30, 2026.
  constraint reservations_date_unique unique (date)
);

create index if not exists idx_reservations_date on reservations (date);

-- Enable Row Level Security
alter table reservations enable row level security;

-- Everyone (anon key) can read reservations, to display the calendar
-- and see which dates are already taken.
drop policy if exists "reservations_select_public" on reservations;
create policy "reservations_select_public"
  on reservations for select
  to anon, authenticated
  using (true);

-- Everyone can propose a reservation... EXCEPT on September 30, 2026,
-- which is explicitly blocked at the security-policy level, in addition
-- to the UNIQUE constraint above (defense in depth: even if the
-- "Moustakim" row were accidentally deleted, this date would still be
-- forbidden for public inserts).
drop policy if exists "reservations_insert_public_except_protected_date" on reservations;
create policy "reservations_insert_public_except_protected_date"
  on reservations for insert
  to anon, authenticated
  with check (date <> date '2026-09-30');

-- Nobody (anon key) can update or delete a reservation:
-- no UPDATE/DELETE policy is created => denied by default.

-- Insert the official reservation (run here as the SQL admin, so it is
-- not subject to the policy above).
insert into reservations (date, reserved_by, status)
values ('2026-09-30', 'Moustakim', 'confirmed')
on conflict (date) do nothing;


-- -------------------------------------------------------------------------
-- 2. TABLE meeting_dates
--    The "real" date chosen for the next date night, picked on /date.
--    We keep a history (each change = a new row); the most recent row
--    is the currently active choice.
-- -------------------------------------------------------------------------
create table if not exists meeting_dates (
  id uuid primary key default gen_random_uuid(),
  selected_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_meeting_dates_created_at on meeting_dates (created_at desc);

alter table meeting_dates enable row level security;

drop policy if exists "meeting_dates_select_public" on meeting_dates;
create policy "meeting_dates_select_public"
  on meeting_dates for select
  to anon, authenticated
  using (true);

drop policy if exists "meeting_dates_insert_public" on meeting_dates;
create policy "meeting_dates_insert_public"
  on meeting_dates for insert
  to anon, authenticated
  with check (true);

-- No update/delete for the public: "editing" simply means saving a new
-- choice (a new row), which keeps a full history.


-- -------------------------------------------------------------------------
-- 3. TABLE questionnaire_responses
--    Answers to the elegant, playful questionnaire on /questionnaire.
-- -------------------------------------------------------------------------
create table if not exists questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  meeting_date date,
  location text not null check (char_length(trim(location)) > 0),
  food text not null check (char_length(trim(food)) > 0),
  drink text not null check (char_length(trim(drink)) > 0),
  special_request text,
  expectation_level text not null check (
    expectation_level in (
      'easy_going',
      'few_requirements',
      'knows_exactly',
      'good_luck'
    )
  ),
  created_at timestamptz not null default now()
);

create index if not exists idx_questionnaire_created_at on questionnaire_responses (created_at desc);

alter table questionnaire_responses enable row level security;

drop policy if exists "questionnaire_select_public" on questionnaire_responses;
create policy "questionnaire_select_public"
  on questionnaire_responses for select
  to anon, authenticated
  using (true);

drop policy if exists "questionnaire_insert_public" on questionnaire_responses;
create policy "questionnaire_insert_public"
  on questionnaire_responses for insert
  to anon, authenticated
  with check (true);

-- -------------------------------------------------------------------------
-- 4. STORAGE BUCKET "photos"
--    Used to host the homepage photograph. You upload the picture
--    yourself from the Supabase Dashboard (Storage > photos > Upload
--    file) — the website only ever reads from this bucket, it never
--    lets a visitor upload to it.
-- -------------------------------------------------------------------------

-- Create a public bucket named "photos" (public = objects can be
-- displayed directly by URL, without authentication — needed so the
-- <img> tag on the homepage can load the picture).
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Allow everyone to LIST and READ files in this bucket (required both
-- for the public image URL to work and for the homepage to
-- automatically find the most recently uploaded picture).
drop policy if exists "photos_public_read" on storage.objects;
create policy "photos_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'photos');

-- Deliberately NO insert/update/delete policy for the public: nobody
-- can upload, replace or delete a file from the website itself. The
-- only way to add or change the photo is from the Supabase Dashboard
-- (which uses your own authenticated session, not the anon key), which
-- is exactly what we want for a personal, single-owner site.

-- =========================================================================
--  End of script. Quick checks you can run afterwards:
--
--  select * from reservations;
--  select * from meeting_dates order by created_at desc;
--  select * from questionnaire_responses order by created_at desc;
--  select * from storage.objects where bucket_id = 'photos';
-- =========================================================================
