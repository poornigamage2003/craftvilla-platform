import type { Metadata } from "next";
import { Young_Serif, DM_Sans, Caveat, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import "./globals.css";

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["600"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎨 CraftVilla | Personalized Gift & Handicraft E-Commerce Platform",
  description: "Bespoke handcrafted gifts and artisanal treasures from Sri Lanka. Personalize with live proofing, ethical fair trade, and island-wide delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${dmSans.variable} ${caveat.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Suspense
          fallback={
            <div className="h-14 border-b border-[var(--line)] bg-[var(--surface)]" />
          }
        >
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
