import type { Metadata } from "next";
import { Outfit, Playfair_Display, Syne } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { site } from "@/content/site";
import {
  buildAreaServedJsonLd,
  localitySeoKeywords,
} from "@/content/localities";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/** Jen LogoMark / koncepty — nepreloadovat na každou stránku. */
const playfair = Playfair_Display({
  variable: "--font-logo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default:
      "Detailing Praha — leštění od 9 600 Kč | Dr Detailing Praha 9",
    template: "%s | Dr Detailing",
  },
  description:
    "Detailing Praha — studio Praha 9 (Horní Počernice): rozleštění laku od 9 600 Kč, keramická ochrana od 7 500 Kč, renovace světlometů, čištění interiéru. Dojezd Praha 10, Brandýs, Úvaly, Klánovice, Lysá… Svoz auta.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  keywords: [
    "detailing Praha",
    "detailing auto",
    "auto detailing Praha",
    "rozleštění laku",
    "rozleštění laku auta",
    "leštění aut",
    "leštění karoserie Praha 9",
    "leštění aut Praha 9",
    "keramická ochrana",
    "keramická ochrana laku Praha",
    "keramická ochrana laku Praha 9",
    "keramický povlak Praha 9",
    "renovace světlometů",
    "renovace světel Praha 9",
    "oprava světlometů Praha",
    "rozleštění laku cena",
    "Gtechniq Praha 9",
    "čištění interiéru",
    "čištění interiéru vozu",
    "čištění interiéru auta Praha 9",
    "renovace světlometů Praha 9",
    "renovace laku Praha 9",
    "oprava laku Praha",
    "Dr Detailing",
    "Horní Počernice",
    ...localitySeoKeywords,
  ],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: siteUrl,
    siteName: site.brandName,
    title: "Detailing Praha — leštění od 9 600 Kč | Dr Detailing",
    description: site.motto + " " + site.heroLead,
  },
  twitter: {
    card: "summary_large_image",
    title: "Detailing Praha — leštění od 9 600 Kč | Dr Detailing",
    description: site.motto + " " + site.heroLead,
  },
  icons: {
    icon: [{ url: "/brand/logo-razitko.png" }],
    apple: [{ url: "/brand/logo-razitko.png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    other: {
      "seznam-wmt": "CBAGPNieAgUEgsX36Lo3tRpEJ4ZShiIA",
    },
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "LocalBusiness"],
  "@id": `${siteUrl}/#business`,
  name: site.brandName,
  alternateName: "DR DETAILING",
  legalName: site.legalName,
  url: siteUrl,
  telephone: site.phone,
  email: site.email,
  image: [
    `${siteUrl}/film/polish-hero-start.jpg`,
    `${siteUrl}/film/ceramic-start.webp`,
  ],
  logo: `${siteUrl}/brand/logo.png`,
  description:
    "Detailing Praha — studio Praha 9 (Horní Počernice): leštění a rozleštění laku, keramická ochrana Gtechniq, čištění interiéru a renovace světlometů. Dojezd Praha 10, Brandýs, Úvaly. Svoz auta po domluvě.",
  slogan: site.motto,
  knowsAbout: [
    "detailing Praha",
    "leštění laku",
    "rozleštění laku",
    "rozleštění laku cena",
    "leštění karoserie",
    "keramická ochrana Gtechniq",
    "keramický povlak",
    "čištění interiéru auta",
    "renovace světlometů",
    "detailing Praha 9",
    "detailing Horní Počernice",
    "detailing Praha 10",
    "renovace laku",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lukavecká 1732",
    addressLocality: "Horní Počernice",
    addressRegion: "Praha 9",
    postalCode: "193 00",
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.118,
    longitude: 14.563,
  },
  areaServed: buildAreaServedJsonLd(),
  priceRange: "$$",
  currenciesAccepted: "CZK",
  paymentAccepted: "Cash, Card, BankTransfer",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  hasMap: "https://maps.google.com/?q=Lukaveck%C3%A1+1732,+Horn%C3%AD+Po%C4%8Dernice",
  sameAs: [
    "https://drdetailing.cz/llms.txt",
    "https://drdetailing.cz/detailing-praha-9",
  ],
  identifier: {
    "@type": "PropertyValue",
    name: "IČO",
    value: site.ico,
  },
  makesOffer: [
    {
      "@type": "Offer",
      name: "Leštění laku a karoserie",
      description:
        "Strojní leštění laku a karoserie — oživení a odstranění jemných škrábanců. Od 9 600 Kč.",
      priceCurrency: "CZK",
      price: "9600",
      url: `${siteUrl}/lesteni-laku-praha`,
    },
    {
      "@type": "Offer",
      name: "Renovace laku",
      description: "Vícekroková renovace laku — škrábance a hologramy. Od 23 900 Kč.",
      priceCurrency: "CZK",
      price: "23900",
      url: `${siteUrl}/renovace-laku-praha`,
    },
    {
      "@type": "Offer",
      name: "Keramická ochrana Gtechniq",
      description:
        "Keramická ochrana / keramický povlak Gtechniq na 1–5 let. Od 7 500 Kč (bez přípravy laku).",
      priceCurrency: "CZK",
      price: "7500",
      url: `${siteUrl}/keramicka-ochrana-praha`,
    },
    {
      "@type": "Offer",
      name: "Čištění interiéru auta",
      description: "Kompletní čištění interiéru auta — sedačky, koberce, plasty. Od 3 000 Kč.",
      priceCurrency: "CZK",
      price: "3000",
      url: `${siteUrl}/cisteni-interieru-praha`,
    },
    {
      "@type": "Offer",
      name: "Renovace světlometů (pár)",
      description:
        "Renovace zmatnělých předních světlometů — broušení, leštění, UV. Balíček páru 1 300 Kč.",
      priceCurrency: "CZK",
      price: "1300",
      url: `${siteUrl}/renovace-svetlometu-praha`,
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: site.brandName,
  url: siteUrl,
  inLanguage: "cs-CZ",
  publisher: { "@id": `${siteUrl}/#business` },
  potentialAction: {
    "@type": "ReserveAction",
    target: `${siteUrl}/#objednat`,
    name: "Rezervovat termín",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${outfit.variable} ${syne.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/film/polish-hero-start-mobile.webp"
          type="image/webp"
          media="(max-width: 767px)"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body className="min-h-full bg-[var(--bg)] font-sans text-[var(--fg)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
