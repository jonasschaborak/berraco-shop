import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BERRACO — DROP 001 EMOTIONS",
  description: "Heavyweight embossed tees. RAGE · HATE · LOVE · JOY · FEAR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-sans)]">{children}</body>
    </html>
  );
}
