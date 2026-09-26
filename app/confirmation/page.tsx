import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PaperCard from "@/components/PaperCard";
import Stamp from "@/components/Stamp";
import VintageButton from "@/components/VintageButton";
import { EXPECTATION_LABELS, ExpectationLevel } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage() {
  const supabase = getSupabaseServerClient();

  const [{ data: meetingDate }, { data: response }] = await Promise.all([
    supabase
      .from("meeting_dates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("questionnaire_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const hasFullDossier = meetingDate && response;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        
        
      </div>

      <PaperCard>
        <div className="text-center mb-2">
          
        </div>
        <h2 className="font-display text-center text-xl sm:text-2xl text-bleu-nuit tracking-wide mb-6">
          Thanks for your answer Jiji
        </h2>

        <div className="arabesque-divider mx-auto w-40 mb-6" />

        {hasFullDossier ? (
          <>
            <dl className="max-w-md mx-auto space-y-3 font-body text-bleu-nuit mb-8">
              <Row label="DATE" value={formatDateEn(meetingDate!.selected_date)} />
              <Row label="LOCATION" value={response!.location} />
              <Row label="MEAL" value={response!.food} />
              <Row label="DRINK" value={response!.drink} />
              {response!.special_request && (
                <Row label="SPECIAL REQUEST" value={response!.special_request} />
              )}
              <Row
                label="EXPECTATION LEVEL"
                value={EXPECTATION_LABELS[response!.expectation_level as ExpectationLevel]}
              />
            </dl>

            <Stamp text="APPROVED" />

            <p className="text-center font-body text-sm text-bleu-ancien/80 italic mt-6 max-w-md mx-auto">
             Feel free to reselect any other date for another meeting.
            </p>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="font-body text-bleu-ancien">
              Feel free to reselect any other date for another meeting.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {!meetingDate && (
                <Link href="/date">
                  <VintageButton variant="secondary">Choose the Date</VintageButton>
                </Link>
              )}
              {!response && (
                <Link href="/questionnaire">
                  <VintageButton variant="secondary">Fill in the Questionnaire</VintageButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </PaperCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 border-b border-dore/25 pb-2">
      <dt className="text-xs tracking-widest uppercase text-bleu-ancien/60 sm:w-48 shrink-0">
        {label}
      </dt>
      <dd className="font-medium">{value}</dd>
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
