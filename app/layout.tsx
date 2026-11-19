import type { Metadata } from "next";
import { Inter, Space_Grotesk, Black_Ops_One, Montserrat, Anton } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MIDI_PATTERN_COUNT, ONE_SHOT_COUNT } from "@/lib/bundle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const blackOpsOne = Black_Ops_One({
  variable: "--font-black-ops",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
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
  description: `${MIDI_PATTERN_COUNT} royalty-free MIDI drum patterns and ${ONE_SHOT_COUNT} drum one-shots for dark trap, RnB and soul. Drag and drop into any DAW.`,
  keywords: [
    "MIDI kits",
    "MIDI drum kits",
    "drum samples",
    "beat making",
    "royalty free MIDI",
    "FL Studio MIDI",
    "Ableton Live packs",
  ],
  openGraph: {
    title: "Download MIDI Drum Kits | Premium Packs",
    description:
      "Finish beats faster with drag-and-drop MIDI drum patterns and trap one-shots.",
    type: "website",
    siteName: "MidiRoad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download MIDI Drum Kits | Premium Packs",
    description: "Drag-and-drop MIDI drum kits and trap one-shots for producers.",
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
  } catch {
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
        className={`${blackOpsOne.variable} ${montserrat.variable} ${anton.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased font-sans`}
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
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
