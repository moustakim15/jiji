import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bleu-nuit": "#0d1b30",
        "bleu-royal": "#1e3a5f",
        "bleu-ancien": "#2c4a6e",
        "bleu-pastel": "#a9c4dd",
        "creme": "#f3ecdd",
        "blanc-casse": "#faf6ec",
        "dore": "#c8a24a",
        "dore-clair": "#e4cd8f",
        "encre": "#1a1a2e",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-amiri)", "Georgia", "serif"],
        body: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(circle at 20% 20%, rgba(200,162,74,0.06) 0%, transparent 45%), radial-gradient(circle at 80% 60%, rgba(30,58,95,0.06) 0%, transparent 50%)",
      },
      boxShadow: {
        vintage: "0 2px 4px rgba(13,27,48,0.15), 0 12px 24px -8px rgba(13,27,48,0.25)",
        stamp: "0 0 0 2px rgba(200,162,74,0.6)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stampIn: {
          "0%": { opacity: "0", transform: "scale(2.4) rotate(-18deg)" },
          "60%": { opacity: "1", transform: "scale(0.92) rotate(-12deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-12deg)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-out both",
        stampIn: "stampIn 0.6s cubic-bezier(.2,.8,.3,1.2) both",
        spinSlow: "spinSlow 6s linear infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
