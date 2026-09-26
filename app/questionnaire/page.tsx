import { getSupabaseServerClient } from "@/lib/supabase/server";
import PaperCard from "@/components/PaperCard";
import Questionnaire from "@/components/Questionnaire";

export const dynamic = "force-dynamic";

export default async function QuestionnairePage() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("meeting_dates")
    .select("selected_date")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
       
        <h1 className="font-display text-2xl sm:text-4xl text-white">
          Preparatory Questionnaire
        </h1>
        <p className="max-w-xl mx-auto mt-3 font-body text-white">
          Please complete this form with the utmost seriousness. The
          committee's operations depend on it entirely.
        </p>
      </div>

      <PaperCard>
        <Questionnaire meetingDate={data?.selected_date ?? null} />
      </PaperCard>
    </div>
  );
}
