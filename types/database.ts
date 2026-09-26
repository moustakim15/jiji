export type ReservationStatus = "pending" | "confirmed" | "rejected";

export type ExpectationLevel =
  | "easy_going"
  | "few_requirements"
  | "knows_exactly"
  | "good_luck";

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  reserved_by: string;
  status: ReservationStatus;
  created_at: string;
}

export interface MeetingDate {
  id: string;
  selected_date: string; // YYYY-MM-DD
  created_at: string;
}

export interface QuestionnaireResponse {
  id: string;
  meeting_date: string | null;
  location: string;
  food: string;
  drink: string;
  special_request: string | null;
  expectation_level: ExpectationLevel;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: Reservation;
        Insert: Omit<Reservation, "id" | "created_at" | "status"> & {
          status?: ReservationStatus;
        };
        Update: Partial<Reservation>;
      };
      meeting_dates: {
        Row: MeetingDate;
        Insert: Omit<MeetingDate, "id" | "created_at">;
        Update: Partial<MeetingDate>;
      };
      questionnaire_responses: {
        Row: QuestionnaireResponse;
        Insert: Omit<QuestionnaireResponse, "id" | "created_at">;
        Update: Partial<QuestionnaireResponse>;
      };
    };
  };
}

// Protected date of the "official system" — used for display and for
// client-side checks. The real protection lives in the database (see
// supabase/schema.sql): a UNIQUE constraint + a restrictive RLS policy.
export const PROTECTED_DATE = "2026-09-30";
export const PROTECTED_DATE_OWNER = "Jad";

export const EXPECTATION_LABELS: Record<ExpectationLevel, string> = {
  easy_going: "I'm easy going",
  few_requirements: "I have a few requirements",
  knows_exactly: "I know exactly what I want",
  good_luck: "Good luck.",
};
