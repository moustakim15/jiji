import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/date", label: "1. PLEASE Choose the Date" },
  { href: "/questionnaire", label: "2. Questionnaire" },
 
];
function LilyIcon({ size = 42, color = "#c8a24a" }) {
  const cx = 32;
  const cy = 32;

  // Un tépale (pétale de lys) pointu, légèrement recourbé vers l'extérieur
  const petalPath =
    "M32,32 " +
    "C28,25 25,17 27,9 " +
    "C28,5 30,3 32,2 " +
    "C34,3 36,5 37,9 " +
    "C39,17 36,25 32,32 " +
    "Z";

  const petalAngles = [0, 60, 120, 180, 240, 300];
  const stamenAngles = [30, 90, 150, 210, 270, 330];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* 6 tépales disposés en étoile, vus de dessus */}
      {petalAngles.map((angle) => (
        <path
          key={`petal-${angle}`}
          d={petalPath}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}

      {/* 6 étamines fines avec anthère ovale au bout */}
      {stamenAngles.map((angle) => (
        <g key={`stamen-${angle}`} transform={`rotate(${angle} ${cx} ${cy})`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 14}
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <ellipse
            cx={cx}
            cy={cy - 15.5}
            rx="1.6"
            ry="2.6"
            fill={color}
            transform={`rotate(20 ${cx} ${cy - 15.5})`}
          />
        </g>
      ))}

      {/* Pistil central */}
      <circle cx={cx} cy={cy} r="2.2" fill={color} />
    </svg>
  );
}


export default function Header() {
  return (
    <header className="border-b border-dore/30 bg-bleu-nuit/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <LilyIcon />
          <span className="font-display text-creme text-sm sm:text-base tracking-wide leading-tight">
            JijiBooking<br className="hidden sm:block" /> 
          </span>
        </Link>
        <nav className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-[11px] sm:text-xs font-body uppercase tracking-wider text-bleu-pastel">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-dore-clair transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SealIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="none" stroke="#c8a24a" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="12" fill="none" stroke="#c8a24a" strokeWidth="0.6" />
      <path
        d="M20 10 L22.5 17.5 L30 17.5 L24 22 L26.5 29.5 L20 25 L13.5 29.5 L16 22 L10 17.5 L17.5 17.5 Z"
        fill="#c8a24a"
        opacity="0.85"
      />
    </svg>
  );
}
