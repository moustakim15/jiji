import { getSupabaseServerClient } from "@/lib/supabase/server";
import DateSelector from "@/components/DateSelector";
import PaperCard from "@/components/PaperCard";
import Questionnaire from "@/components/Questionnaire";

export const dynamic = "force-dynamic";

export default async function DatePage() {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase
    .from("meeting_dates")
    .select("selected_date")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const selectedDate = data?.selected_date ?? null;

  return (
    <div className="animate-fadeIn">

      {/* ==========================================
          CHOICE OF DATE
      ========================================== */}

      <div className="text-center mb-8">
        <h1 className="font-display text-2xl sm:text-4xl text-white">
          Official Choice of Date
        </h1>

        <p className="max-w-xl mx-auto mt-3 font-body text-white">
          The committee exceptionally leaves it to you to choose the day
          of our next meeting.
        </p>
      </div>

      <DateSelector currentDate={selectedDate} />

      {/* ==========================================
          QUESTIONNAIRE
          Appears once a date has been selected
      ========================================== */}

      {selectedDate && (
        <div className="mt-10 animate-fadeIn">

          <div className="text-center mb-8">
            <p className="font-body italic text-bleu-ancien/70 text-sm mb-2">
              Step 3 of 4
            </p>

            <h2 className="font-display text-2xl sm:text-4xl text-bleu-nuit">
              Preparatory Questionnaire
            </h2>

            <p className="max-w-xl mx-auto mt-3 font-body text-bleu-ancien">
              Please complete this form with the utmost seriousness. The
              committee's operations depend on it entirely.
            </p>
          </div>

          <PaperCard>
            <Questionnaire meetingDate={selectedDate} />
          </PaperCard>

        </div>
      )}

    </div>
  );
}