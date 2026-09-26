import { ReactNode } from "react";

export default function PaperCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative rounded-sm bg-blanc-casse/95",
        "border border-dore/40",
        "shadow-vintage",
        "px-5 py-6 sm:px-10 sm:py-10",
        className,
      ].join(" ")}
    >
      {/* Coins décoratifs façon cadre ancien */}
      <CornerOrnament className="absolute -top-1 -left-1" />
      <CornerOrnament className="absolute -top-1 -right-1 -scale-x-100" />
      <CornerOrnament className="absolute -bottom-1 -left-1 -scale-y-100" />
      <CornerOrnament className="absolute -bottom-1 -right-1 -scale-x-100 -scale-y-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 2 H14 M2 2 V14"
        stroke="#c8a24a"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="2" cy="2" r="2.4" fill="#c8a24a" />
    </svg>
  );
}
