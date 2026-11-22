import type { Metadata } from "next";
import { Inter, Space_Grotesk, Black_Ops_One, Montserrat, Anton } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteJsonLd } from "@/lib/site";

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

const HOME_TITLE = "MIDI Drum Kits for Trap & Drill + Free Beat Maker | MidiRoad";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: {
    google: "2I4opu_i4ibpzNbr4aZGNVITaV38iWPM9IcknqvL-ws",
  },
  keywords: [
    "MIDI drum kits",
    "trap MIDI drum kit",
    "drill MIDI drum patterns",
    "808 MIDI",
    "hi-hat MIDI patterns",
    "royalty free MIDI",
    "free beat maker",
    "trap beat maker online",
    "FL Studio MIDI",
    "Ableton MIDI packs",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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
  const EXCLUDED_IPS = ["99.246.255.197"];
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
        <JsonLd data={siteJsonLd()} />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
