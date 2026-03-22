import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIDIKits | Premium MIDI Drum Kits & Production Tools",
  description:
    "Instantly level up your production with 300+ royalty-free MIDI sequences and 200+ pro-grade drum samples. Built for modern producers. Compatible with all major DAWs.",
  keywords: [
    "MIDI kits",
    "MIDI drum kits",
    "drum samples",
    "beat making",
    "music production plugins",
    "royalty free MIDI",
    "FL Studio MIDI",
    "Ableton Live packs",
  ],
  openGraph: {
    title: "MIDIKits | Premium MIDI Drum Kits",
    description:
      "Get unstuck and finish tracks faster with drag-and-drop MIDI loops, chord progressions, and modern drum hits.",
    type: "website",
    siteName: "MIDIKits",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIDIKits | Premium MIDI Drum Kits",
    description: "Drag-and-drop MIDI loops and drum kits for modern producers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
