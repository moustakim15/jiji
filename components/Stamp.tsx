export default function Stamp({ text = "APPROVED" }: { text?: string }) {
  return (
    <div className="flex justify-center my-6">
      <div
        className="animate-stampIn -rotate-12 select-none rounded-full border-[3px] border-double px-6 py-3"
        style={{ borderColor: "#a83232", color: "#a83232" }}
      >
        <span className="font-display text-xl sm:text-2xl tracking-[0.2em] uppercase">
          {text}
        </span>
      </div>
    </div>
  );
}
