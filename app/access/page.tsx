import PaperCard from "@/components/PaperCard";
import VintageButton from "@/components/VintageButton";
import { verifyAccessCode } from "./actions";

export default function AccessPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams?.error === "1";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fadeIn">
      <PaperCard className="max-w-md w-full text-center">
        
        <h3 className="font-display text-2xl text-bleu-nuit mb-4">
         Please
          enter your access code to proceed.
        </h3>
       

        <form action={verifyAccessCode} className="space-y-4">
          <input
            type="password"
            name="code"
            required
            autoFocus
            placeholder="Access code"
            className="w-full text-center tracking-[0.3em] rounded-sm border border-bleu-ancien/30 bg-blanc-casse px-3 py-3 text-lg font-body text-bleu-nuit focus:outline-none focus:ring-2 focus:ring-dore/60"
          />
          <VintageButton type="submit" className="w-full justify-center">
            Enter
          </VintageButton>
        </form>

        {hasError && (
          <p className="mt-5 text-sm font-body text-red-800/90 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
            Access denied. Who the fuck are you ?
          </p>
        )}
      </PaperCard>
    </div>
  );
}