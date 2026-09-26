import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MusicPlayer from "@/components/MusicPlayer";
import { getPhotoUrlByPrefix } from "@/lib/storage";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "The Official Bureau of Appointments",
  description:
    "The official, extremely serious system for scheduling our next date.",
};

// The layout reads Supabase Storage on every request, so the background
// image (and the homepage hero photo) can change without a redeploy.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Upload a picture named "background" (e.g. "background.jpg") directly
  // into the "photos" bucket in Supabase Storage, and it will be used as
  // the site-wide background automatically — no code change, no
  // redeploy needed.
  const backgroundUrl = await getPhotoUrlByPrefix("background");

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${amiri.variable} font-body antialiased`}
      >
        {backgroundUrl && (
          <div
            aria-hidden="true"
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(rgba(13,27,48,0.6), rgba(13,27,48,0.78)), url("${backgroundUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14 pb-40">
          {children}
        </main>
        <MusicPlayer />
      </body>
    </html>
  );
}