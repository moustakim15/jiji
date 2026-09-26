"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface VintageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function VintageButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: VintageButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 font-display text-sm tracking-wide rounded-sm border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-bleu-royal text-creme border-dore/70 hover:bg-bleu-nuit hover:shadow-vintage active:scale-[0.98]"
      : "bg-transparent text-bleu-nuit border-bleu-ancien/50 hover:bg-bleu-pastel/20 active:scale-[0.98]";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
