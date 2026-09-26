"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// ==========================================
// SPOTIFY
// ==========================================

const PLAYLIST_ID = "7cpbUEKyvpLypxHEE2ZgdR";

const SPOTIFY_EMBED_SRC =
  `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}` +
  `?utm_source=generator&theme=0`;

// ==========================================
// YOUTUBE — UNIQUEMENT POUR /date
// ==========================================

const VIDEO_ID = "4NE-bsrNodQ";

// 14 minutes 48 secondes
const START_TIME = 888;

const YOUTUBE_EMBED_SRC =
  `https://www.youtube.com/embed/${VIDEO_ID}` +
  `?start=${START_TIME}&autoplay=1`;

export default function MusicPlayer() {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);

  // /date = YouTube
  const isDatePage = pathname === "/date";

  return (
    <div
      className={[
        "fixed z-40 transition-all duration-500",
        "bottom-3 right-3 left-3 sm:left-auto sm:right-5 sm:bottom-5",
        "sm:w-[360px]",
      ].join(" ")}
    >
      <div className="relative rounded-lg border-2 border-dore/70 bg-bleu-nuit shadow-vintage overflow-hidden">

        {/* ==========================================
            HEADER
        ========================================== */}

        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-bleu-nuit via-bleu-royal to-bleu-nuit text-creme"
          aria-expanded={open}
          aria-controls="music-player-body"
        >
          <VinylIcon spinning={open} />

          <span className="font-display text-xs tracking-wide uppercase text-dore-clair">
            {isDatePage
              ? " Click here أغدا ألقاك ؟"
              : ""}
          </span>

          <span className="ml-auto text-dore-clair text-lg leading-none">
            {open ? "–" : "+"}
          </span>
        </button>

        {/* ==========================================
            PLAYER
        ========================================== */}

        <div
          id="music-player-body"
          className={open ? "block" : "hidden"}
        >

          {/* ========================================
              /date → YOUTUBE
          ======================================== */}

          {isDatePage ? (
            <>
              <div className="px-3 pt-3 pb-1 text-[11px] text-bleu-pastel/80 font-body italic">
                Official song for Jiji
              </div>

              <div className="px-3 pb-3">
                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-inner">
                  <iframe
                    title="YouTube player — official song"
                    src={YOUTUBE_EMBED_SRC}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </>
          ) : (

            /* ========================================
               AUTRES PAGES → SPOTIFY
            ======================================== */

            <>
              <div className="px-3 pt-3 pb-1 text-[11px] text-bleu-pastel/80 font-body italic">
                Official playlist jiji
              </div>

              <div
                className="px-3 pb-3"
                style={{
                  maxHeight: "calc(100vh - 140px)",
                  overflowY: "auto",
                }}
              >
                <iframe
                  title="Spotify player — official playlist"
                  style={{ borderRadius: "8px" }}
                  src={SPOTIFY_EMBED_SRC}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="shadow-inner"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VINYL ICON
// ==========================================

function VinylIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="22"
      height="22"
      className={spinning ? "animate-spinSlow" : ""}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="#0d1b30"
        stroke="#c8a24a"
        strokeWidth="1.5"
      />

      <circle
        cx="20"
        cy="20"
        r="12"
        fill="none"
        stroke="#c8a24a"
        strokeWidth="0.75"
        opacity="0.5"
      />

      <circle
        cx="20"
        cy="20"
        r="7"
        fill="none"
        stroke="#c8a24a"
        strokeWidth="0.75"
        opacity="0.5"
      />

      <circle
        cx="20"
        cy="20"
        r="3"
        fill="#c8a24a"
      />
    </svg>
  );
}