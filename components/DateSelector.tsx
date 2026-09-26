"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VintageCalendar, { CalendarMarker } from "./VintageCalendar";
import VintageButton from "./VintageButton";
import PaperCard from "./PaperCard";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function DateSelector({
  currentDate,
}: {
  currentDate: string | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(currentDate);
  const [editing, setEditing] = useState(!currentDate);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markers: Record<string, CalendarMarker> = {};
  const highlighted = pending ?? confirmedDate;
  if (highlighted) {
    markers[highlighted] = { label: "Date under consideration", variant: "selected" };
  }

  async function handleConfirm() {
    if (!pending) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabaseBrowser
      .from("meeting_dates")
      .insert({ selected_date: pending });

    setSubmitting(false);

    if (insertError) {
      setError("Your choice could not be recorded in the registry. Please try again.");
      return;
    }

    setConfirmedDate(pending);
    setPending(null);
    setEditing(false);
    router.refresh();
  }

  if (!editing && confirmedDate) {
    return (
      <PaperCard className="text-center">
        
        <h2 className="font-display text-2xl text-bleu-nuit mb-4">
          Your choice has been officially recorded.
        </h2>
        <p className="font-body text-xl text-bleu-royal mb-6">
          {formatDateEn(confirmedDate)}
        </p>
        
        <VintageButton variant="secondary" onClick={() => setEditing(true)}>
          Edit my choice
        </VintageButton>
      </PaperCard>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <PaperCard>
        <VintageCalendar
          initialYear={2026}
          initialMonth={8}
          markers={markers}
          onSelectDate={(iso) => setPending(iso)}
          disablePastDates
        />
      </PaperCard>

      <PaperCard>
        <h2 className="font-display text-lg text-bleu-nuit mb-3">
          Confirm Your Choice
        </h2>
        {pending ? (
          <>
            <p className="font-body text-sm text-bleu-ancien mb-5">
              Date under consideration:{" "}
              <span className="font-semibold text-bleu-nuit">
                {formatDateEn(pending)}
              </span>
            </p>
            <VintageButton onClick={handleConfirm} disabled={submitting}>
              {submitting ? "Recording…" : "Officially confirm this choice"}
            </VintageButton>
          </>
        ) : (
          <p className="font-body text-sm text-bleu-ancien/70 italic">
            Please select a date on the calendar to the left.
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm font-body text-red-800/90 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
            {error}
          </p>
        )}
        {confirmedDate && (
          <button
            onClick={() => {
              setEditing(false);
              setPending(null);
              setError(null);
            }}
            className="mt-5 text-xs font-body text-bleu-ancien/60 underline"
          >
            Cancel and return to previous choice
          </button>
        )}
      </PaperCard>
    </div>
  );
}

function formatDateEn(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
