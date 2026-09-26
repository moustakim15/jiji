import { getSupabaseServerClient } from "@/lib/supabase/server";
import ReservationBoard from "@/components/ReservationBoard";
import type { Reservation } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true });

  const reservations: Reservation[] = data ?? [];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        
        <h1 className="font-display text-2xl sm:text-4xl text-bleu-nuit">
          Your schedule
        </h1>
        <p className="max-w-xl mx-auto mt-3 font-body text-bleu-ancien">
          Please review the calendar below. Certain dates are already
          under administrative control and may not, under any
          circumstances, be the subject of a new request.
        </p>
      </div>

      <ReservationBoard initialReservations={reservations} />
    </div>
  );
}
