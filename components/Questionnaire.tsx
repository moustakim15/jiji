"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import VintageButton from "./VintageButton";

const MEETING_LOCATIONS = ["Kenitra", "Rabat", "Other"];

const PLACES = [
  "Lwad",
  "Your coffee shop",
  "Somewhere to eat",
  "Lwad again", "Other"
];

const HAPPINESS_OPTIONS = [
  "Yes",
  "No fuck off",
  "Yes andik lwad",
  "Other",
];

function ChipGroup({
  options,
  value,
  customValue,
  onSelect,
  onCustomChange,
  name,
}: {
  options: string[];
  value: string;
  customValue: string;
  onSelect: (v: string) => void;
  onCustomChange: (v: string) => void;
  name: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;

          return (
            <button
              type="button"
              key={opt}
              onClick={() => onSelect(opt)}
              className={[
                "px-3.5 py-1.5 rounded-full text-sm font-body border transition-colors",
                active
                  ? "bg-bleu-royal text-creme border-bleu-royal"
                  : "bg-blanc-casse text-bleu-nuit border-bleu-ancien/30 hover:border-bleu-ancien",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {value === "Other" && (
        <input
          type="text"
          required
          placeholder="Please specify…"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          name={`${name}_other`}
          className="mt-3 w-full rounded-sm border border-bleu-ancien/30 bg-blanc-casse px-3 py-2 text-sm font-body text-bleu-nuit focus:outline-none focus:ring-2 focus:ring-dore/60"
        />
      )}
    </div>
  );
}

export default function Questionnaire({
  meetingDate,
}: {
  meetingDate: string | null;
}) {
  const router = useRouter();

  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingLocationOther, setMeetingLocationOther] = useState("");

  const [meetingTime, setMeetingTime] = useState("");

  const [place, setPlace] = useState("");
  const [placeOther, setPlaceOther] = useState("");

  const [specialRequest, setSpecialRequest] = useState("");

  const [happiness, setHappiness] = useState("");
  const [happinessOther, setHappinessOther] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const finalMeetingLocation =
      meetingLocation === "Other"
        ? meetingLocationOther.trim()
        : meetingLocation;

    const finalPlace =
      place === "Other" ? placeOther.trim() : place;

    const finalHappiness =
      happiness === "Other"
        ? happinessOther.trim()
        : happiness;

    if (
      !finalMeetingLocation ||
      !meetingTime ||
      !finalPlace ||
      !finalHappiness
    ) {
      setError(
        "The committee requires a complete file. Please answer all required questions."
      );
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabaseBrowser
      .from("questionnaire_responses")
      .insert({
        meeting_date: meetingDate,
        location: finalMeetingLocation,
        meeting_time: meetingTime,
        place: finalPlace,
        special_request: specialRequest.trim() || null,
        happiness: finalHappiness,
      });

    setSubmitting(false);

    if (insertError) {
      console.error(insertError);

      setError(
        "This form could not be transmitted. Please try again."
      );
      return;
    }

    router.push("/confirmation");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 1. WHERE TO MEET */}
      <fieldset>
        <legend className="font-display text-lg text-bleu-nuit mb-3">
          1. Where should we meet?
        </legend>

        <ChipGroup
          name="meeting_location"
          options={MEETING_LOCATIONS}
          value={meetingLocation}
          customValue={meetingLocationOther}
          onSelect={setMeetingLocation}
          onCustomChange={setMeetingLocationOther}
        />
      </fieldset>

      {/* 2. TIME */}
      <fieldset>
        <legend className="font-display text-lg text-bleu-nuit mb-3">
          2. At what time?
        </legend>

        <div className="flex items-center gap-3">
          <input
            type="time"
            required
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="rounded-sm border border-bleu-ancien/30 bg-blanc-casse px-4 py-2.5 text-sm font-body text-bleu-nuit focus:outline-none focus:ring-2 focus:ring-dore/60"
          />
        </div>
      </fieldset>

      {/* 3. WHERE SHOULD WE GO */}
      <fieldset>
        <legend className="font-display text-lg text-bleu-nuit mb-3">
          3. Where should we go?
        </legend>

        <ChipGroup
          name="place"
          options={PLACES}
          value={place}
          customValue={placeOther}
          onSelect={setPlace}
          onCustomChange={setPlaceOther}
        />
      </fieldset>

      {/* 4. SPECIAL REQUESTS */}
      <fieldset>
        <legend className="font-display text-lg text-bleu-nuit mb-3">
          4. Any special requests?
        </legend>

        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          rows={3}
          placeholder="The committee takes note of any demand, reasonable or not."
          className="w-full rounded-sm border border-bleu-ancien/30 bg-blanc-casse px-3 py-2 text-sm font-body text-bleu-nuit focus:outline-none focus:ring-2 focus:ring-dore/60"
        />
      </fieldset>

      {/* 5. ARE YOU HAPPY */}
      <fieldset>
        <legend className="font-display text-lg text-bleu-nuit mb-3">
          5. Are you excited?
        </legend>

        <ChipGroup
          name="happiness"
          options={HAPPINESS_OPTIONS}
          value={happiness}
          customValue={happinessOther}
          onSelect={setHappiness}
          onCustomChange={setHappinessOther}
        />
      </fieldset>

      {/* ERROR */}
      {error && (
        <p className="text-sm font-body text-red-800/90 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <div className="pt-2">
        <VintageButton type="submit" disabled={submitting}>
          {submitting
            ? "Submitting…"
            : "Submit File to the Committee"}
        </VintageButton>
      </div>
    </form>
  );
}