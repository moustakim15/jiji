"use client";

import { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export type CalendarMarkerVariant = "reserved" | "selected";

export interface CalendarMarker {
  label: string;
  variant: CalendarMarkerVariant;
}

interface VintageCalendarProps {
  initialYear: number;
  initialMonth: number; // 0-indexed (0 = January)
  markers?: Record<string, CalendarMarker>; // key = "YYYY-MM-DD"
  onSelectDate?: (dateStr: string) => void;
  disablePastDates?: boolean;
  allowNavigation?: boolean;
}

function toISODate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function VintageCalendar({
  initialYear,
  initialMonth,
  markers = {},
  onSelectDate,
  disablePastDates = false,
  allowNavigation = true,
}: VintageCalendarProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const firstOfMonth = new Date(year, month, 1);
  // Convert Sunday(0)..Saturday(6) into a Monday-first week
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayISO = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function goToPrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {allowNavigation ? (
          <button
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="px-3 py-1 rounded-sm border border-bleu-ancien/40 text-bleu-nuit hover:bg-bleu-pastel/20"
          >
            ‹
          </button>
        ) : <span />}
        <h3 className="font-display text-lg text-bleu-nuit tracking-wide">
          {MONTHS[month]} {year}
        </h3>
        {allowNavigation ? (
          <button
            onClick={goToNextMonth}
            aria-label="Next month"
            className="px-3 py-1 rounded-sm border border-bleu-ancien/40 text-bleu-nuit hover:bg-bleu-pastel/20"
          >
            ›
          </button>
        ) : <span />}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((j) => (
          <div
            key={j}
            className="text-center text-[11px] font-body tracking-wider text-bleu-ancien/70 uppercase"
          >
            {j}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const iso = toISODate(year, month, day);
          const marker = markers[iso];
          const isPast = disablePastDates && iso < todayISO;
          const isReserved = marker?.variant === "reserved";
          const isSelected = marker?.variant === "selected";
          const disabled = isPast || isReserved;

          return (
            <button
              key={iso}
              disabled={disabled && !isReserved ? true : false}
              onClick={() => onSelectDate?.(iso)}
              title={marker?.label}
              className={[
                "relative aspect-square rounded-sm text-sm font-body transition-colors",
                "flex items-center justify-center",
                isSelected
                  ? "bg-dore text-bleu-nuit font-semibold shadow-vintage"
                  : isReserved
                  ? "bg-bleu-nuit/90 text-dore-clair cursor-pointer"
                  : isPast
                  ? "text-bleu-ancien/25 cursor-not-allowed"
                  : "text-bleu-nuit hover:bg-bleu-pastel/25 cursor-pointer border border-transparent hover:border-bleu-pastel/50",
              ].join(" ")}
            >
              {day}
              {isReserved && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-dore-clair">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {Object.values(markers).some((m) => m.variant === "reserved") && (
        <p className="mt-3 text-[11px] text-bleu-ancien/70 font-body italic">
          ★ Date under administrative control — see note below.
        </p>
      )}
    </div>
  );
}
