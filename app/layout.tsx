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
  title: "Download MIDI Drum Kits | Premium Packs",
  verification: {
    google: "2I4opu_i4ibpzNbr4aZGNVITaV38iWPM9IcknqvL-ws",
  },
  description:
    "838 royalty-free MIDIs, drums and presets for dark trap, RnB and soul. Built for modern producers. Compatible with all major DAWs.",
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
    title: "Download MIDI Drum Kits | Premium Packs",
    description:
      "Get unstuck and finish tracks faster with drag-and-drop MIDI loops, chord progressions, and modern drum hits.",
    type: "website",
    siteName: "MidiRoad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download MIDI Drum Kits | Premium Packs",
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
    userIP =
      headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "";
  } catch (e) {
    // Failsafe for build-time static generation
  }

  // Prevent Google Analytics for excluded IPs (owner) or Localhost
  const EXCLUDED_IPS = ["99.245.213.180"];
  const isDevIP =
    process.env.NODE_ENV === "development" ||
    EXCLUDED_IPS.some((ip) => userIP.includes(ip));

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased font-sans`}
      >
        {/* Conditionally render Google Analytics based on IP */}
        {!isDevIP ? (
          <>
            <Script
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-9HYPTS5VTB"
            />
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
                  console.log('%c[Analytics] ✅ Google Analytics is RUNNING', 'color: green; font-weight: bold;');
                `,
              }}
            />
          </>
        ) : (
          <script
            dangerouslySetInnerHTML={{
              __html: `console.log('%c[Analytics] ⛔ Google Analytics BLOCKED (excluded IP / dev mode)', 'color: orange; font-weight: bold;');`,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
