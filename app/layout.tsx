import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
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
  title: "MidiRoad | Premium MIDI Drum Kits & Production Tools",
  verification: {
    google: "2I4opu_i4ibpzNbr4aZGNVITaV38iWPM9IcknqvL-ws",
  },
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
    title: "MidiRoad | Premium MIDI Drum Kits",
    description:
      "Get unstuck and finish tracks faster with drag-and-drop MIDI loops, chord progressions, and modern drum hits.",
    type: "website",
    siteName: "MidiRoad",
  },
  twitter: {
    card: "summary_large_image",
    title: "MidiRoad | Premium MIDI Drum Kits",
    description: "Drag-and-drop MIDI loops and drum kits for modern producers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userIP = "";
  try {
    const headersList = await headers();
    userIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "";
  } catch (e) {
    // Failsafe for build-time static generation
  }

  // Prevent Google Analytics if it's the Dev IP (173.35.162.117) or Localhost
  const isDevIP = userIP.includes("173.35.162.117") || process.env.NODE_ENV === "development";

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased font-sans`}
      >
        {/* Conditionally render Google Analytics based on IP */}
        {!isDevIP && (
          <>
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-9HYPTS5VTB" />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-9HYPTS5VTB', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
