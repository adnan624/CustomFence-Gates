import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Anton, Poppins } from "next/font/google";
import "./globals.css";

// Display/impact font used by the flipbook chapter numbers and cover.
const impact = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-impact",
});

// Heading + body font for the catalogue (mirrors the main site's active pairing).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const fontVariables = `${impact.variable} ${poppins.variable}`;

export const metadata: Metadata = {
  title: "The Catalogue | Custom Fence & Gates",
  description:
    "Flip through the Custom Fence & Gates catalogue — cedar, vinyl, chain-link, aluminum, repairs, and custom gates, with styles, finishes, and specifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      style={
        {
          "--font-display": "var(--font-poppins)",
          "--font-family-sans": "var(--font-poppins)",
        } as CSSProperties
      }
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
