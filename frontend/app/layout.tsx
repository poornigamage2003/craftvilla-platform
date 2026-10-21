import type { Metadata } from "next";
import { Young_Serif, DM_Sans, Caveat, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
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
  weight: ["600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CraftVilla – Handmade, made for you",
  description: "Personalized gifts and artisanal handicrafts from Sri Lanka (LKR)",
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
        <main>{children}</main>
        <Toast />
      </body>
    </html>
  );
}
