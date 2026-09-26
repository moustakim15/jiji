import Link from "next/link";
import PaperCard from "@/components/PaperCard";
import VintageButton from "@/components/VintageButton";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPhotoUrlByPrefix } from "@/lib/storage";

import ReservationBoard from "@/components/ReservationBoard";

import type { Reservation } from "@/types/database";
export const dynamic = "force-dynamic";

function LilyIcon({ size = 42, color = "#c8a24a" }) {
  const cx = 32;
  const cy = 32;

  // Un tépale (pétale de lys) pointu, légèrement recourbé vers l'extérieur
  const petalPath =
    "M32,32 " +
    "C28,25 25,17 27,9 " +
    "C28,5 30,3 32,2 " +
    "C34,3 36,5 37,9 " +
    "C39,17 36,25 32,32 " +
    "Z";

  const petalAngles = [0, 60, 120, 180, 240, 300];
  const stamenAngles = [30, 90, 150, 210, 270, 330];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* 6 tépales disposés en étoile, vus de dessus */}
      {petalAngles.map((angle) => (
        <path
          key={`petal-${angle}`}
          d={petalPath}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}

      {/* 6 étamines fines avec anthère ovale au bout */}
      {stamenAngles.map((angle) => (
        <g key={`stamen-${angle}`} transform={`rotate(${angle} ${cx} ${cy})`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 14}
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <ellipse
            cx={cx}
            cy={cy - 15.5}
            rx="1.6"
            ry="2.6"
            fill={color}
            transform={`rotate(20 ${cx} ${cy - 15.5})`}
          />
        </g>
      ))}

      {/* Pistil central */}
      <circle cx={cx} cy={cy} r="2.2" fill={color} />
    </svg>
  );
}

export default async function HomePage() {
  // Upload a picture named "hero" (e.g. "hero.jpg") directly into the
  // "photos" bucket in Supabase Storage, and it appears here
  // automatically.
  const heroPhotoUrl = await getPhotoUrlByPrefix("hero");

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true });

  const reservations: Reservation[] = data ?? [];

  return (
    <div className="animate-fadeIn w-full max-w-[1800px] mx-auto">
      <PaperCard className="text-center w-full">

        <div className="arabesque-divider mx-auto w-40 mb-6" />
        <LilyIcon/>
        <h1 className="font-display text-3xl sm:text-5xl text-bleu-nuit leading-tight mb-4">
          Welcome to jiji's
          <br />
          website
        </h1>

        <p className="max-w-xl mx-auto font-body text-base sm:text-lg text-bleu-ancien mb-1">
          Welcome to the official system for scheduling our next meeting.
        </p>

        <p className="max-w-xl mx-auto font-body text-base sm:text-lg text-bleu-ancien mb-10">
          Please follow the steps below carefully. No negligence will be
          tolerated by the committee.
        </p>

        {/* IMAGE + RESERVATION REGISTER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start w-full">

          {/* LEFT — PHOTO */}
          <div className="w-full">
            <PhotoFrame imageUrl={heroPhotoUrl} />

            <p className="max-w-md mx-auto font-body text-sm text-bleu-ancien/80 italic mt-10 mb-8">
              Did you get scared ? I did
            </p>

            <Link href="/date">
              <VintageButton>
                Begin the Procedure
              </VintageButton>
            </Link>
          </div>

          {/* RIGHT — RESERVATIONS */}
          <div className="text-left w-full min-w-0">

            <div className="text-center mb-8">
             

              <h2 className="font-display text-2xl sm:text-3xl text-bleu-nuit">
                Your schedule
              </h2>

              <p className="max-w-xl mx-auto mt-3 font-body text-sm sm:text-base text-bleu-ancien">
                I wouldn't mind having more than one day :)
              </p>
            </div>

            <ReservationBoard
              initialReservations={reservations}
            />

          </div>

        </div>

      </PaperCard>
    </div>
  );
}

/**
 * Large, centered photo element for the homepage.
 *
 * Priority order for the picture shown:
 *  1. The most recent file in the "photos" Supabase Storage bucket
 *     whose name starts with "hero" (uploaded from the Supabase
 *     Dashboard, directly at the bucket root).
 *  2. The NEXT_PUBLIC_HERO_IMAGE_URL environment variable, if set.
 *  3. An elegant placeholder, if neither is available.
 */
function PhotoFrame({ imageUrl }: { imageUrl: string | null }) {
  const resolvedUrl = imageUrl || process.env.NEXT_PUBLIC_HERO_IMAGE_URL || null;

  return (
    <div className="mx-auto w-64 sm:w-80 md:w-[26rem]">
      <div className="relative rounded-sm bg-blanc-casse p-2.5 sm:p-3 shadow-vintage border border-dore/50">
        <div className="rounded-sm border-2 border-double border-dore/70 p-1.5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-gradient-to-br from-bleu-pastel/30 via-creme to-bleu-nuit/10">
            {resolvedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedUrl}
                alt="Our photograph"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <PhotoIcon />
                <p className="font-display text-sm text-bleu-ancien/70">
                  Your photograph belongs here
                </p>
                <p className="font-body text-[11px] text-bleu-ancien/50 italic leading-snug">
                  Upload a picture named "hero" (e.g. "hero.jpg") directly
                  into the "photos" bucket in your Supabase Dashboard
                  (Storage → photos → Upload file) and it will appear
                  here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Corner ornaments */}
        <Corner className="absolute top-0 left-0" />
        <Corner className="absolute top-0 right-0 -scale-x-100" />
        <Corner className="absolute bottom-0 left-0 -scale-y-100" />
        <Corner className="absolute bottom-0 right-0 -scale-x-100 -scale-y-100" />
      </div>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M2 2 H12 M2 2 V12" stroke="#c8a24a" strokeWidth="1.5" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#c8a24a" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="4" y="8" width="32" height="24" rx="2" fill="none" stroke="#c8a24a" strokeWidth="1.4" />
      <circle cx="14" cy="17" r="3.2" fill="none" stroke="#c8a24a" strokeWidth="1.2" />
      <path d="M6 28 L15 19 L22 25 L27 20 L34 27" fill="none" stroke="#c8a24a" strokeWidth="1.2" />
    </svg>
  );
}