
"use client";

import { useState } from "react";
import VintageCalendar, { CalendarMarker } from "./VintageCalendar";
import PaperCard from "./PaperCard";
import {
  PROTECTED_DATE,
  PROTECTED_DATE_OWNER,
  Reservation,
} from "@/types/database";

const OTHER_DATE_MESSAGE =
  "Just kidding. It is impossible to reserve a day to go out with Jiji. The only person who can make a reservation is Jad. FUCK OFF.";

export default function ReservationBoard({
  initialReservations,
}: {
  initialReservations: Reservation[];
}) {
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const reservations = initialReservations;

  const markers: Record<string, CalendarMarker> = {};

  // The reservations already stored in Supabase are displayed
  // on the calendar.
  for (const r of reservations) {
    markers[r.date] = {
      label:
        r.date === PROTECTED_DATE
          ? `Reserved by ${PROTECTED_DATE_OWNER}`
          : `Reserved by ${r.reserved_by}`,
      variant: "reserved",
    };
  }

  function handleSelectDate(iso: string) {
    setFeedback(null);

    // September 30, 2026 has its own special message.
    if (iso === PROTECTED_DATE) {
      setFeedback({
        type: "error",
        text: `September 30, 2026 is reserved by ${PROTECTED_DATE_OWNER}. No other request will be accepted for this date, by decision of the committee.`,
      });
      return;
    }

    // Every other date displays the Jiji/Jad message.
    setFeedback({
      type: "error",
      text: OTHER_DATE_MESSAGE,
    });
  }

  return (
    <PaperCard className="w-full">

      {/* =========================================
          CALENDAR
      ========================================== */}
      <div className="w-full">
        <VintageCalendar
          initialYear={2026}
          initialMonth={8}
          markers={markers}
          onSelectDate={handleSelectDate}
          disablePastDates
        />
      </div>

      {/* =========================================
          DECORATIVE SEPARATOR
      ========================================== */}
      <div className="arabesque-divider mx-auto w-40 my-8" />

      {/* =========================================
          OFFICIAL RESERVATION REGISTER
      ========================================== */}
      <div className="w-full text-center">

        <p className="font-body italic text-bleu-ancien/70 text-sm mb-2">
          Administrative Notice
        </p>

        <h2 className="font-display text-xl sm:text-2xl text-bleu-nuit mb-4">
          Official Reservation Register
        </h2>

        {/* Protected date */}
        <div className="rounded-sm bg-bleu-nuit/95 text-dore-clair text-sm font-body px-4 py-4 mb-5">
          <strong className="text-dore">
            September 30, 2026
          </strong>{" "}
          — Reserved by {PROTECTED_DATE_OWNER}. No other request will be
          accepted for this date, by decision of the committee.
        </div>

        {/* General information */}
        <div className="rounded-sm border border-dore/40 bg-creme px-4 py-4">
          <p className="font-body text-sm text-bleu-ancien leading-relaxed">
            The reservation register is currently under administrative
            control.
          </p>

          <p className="font-body text-sm text-bleu-ancien/80 italic mt-3">
            Select a date on the calendar to verify its availability.
          </p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <p
            className={[
              "mt-5 text-sm font-body rounded-sm px-4 py-3 border",
              feedback.type === "error"
                ? "text-red-800/90 bg-red-50 border-red-200"
                : "text-emerald-800/90 bg-emerald-50 border-emerald-200",
            ].join(" ")}
          >
            {feedback.text}
          </p>
        )}

      </div>

    </PaperCard>
  );
}
