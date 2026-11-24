import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/film/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/before-after/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Seznam Webmaster ověření musí jít přes www bez přesměrování
        source: "/:path((?!seznam-wmt-).*)",
        has: [{ type: "host", value: "www.drdetailing.cz" }],
        destination: "https://drdetailing.cz/:path*",
        permanent: true,
      },
      // Historické / špatně zadané URL (404 ve výsledcích vyhledávání)
      {
        source: "/lesteni-laku-praha-9",
        destination: "/lesteni-laku-praha",
        permanent: true,
      },
      {
        source: "/renovace-svetlometu",
        destination: "/renovace-svetlometu-praha",
        permanent: true,
      },
      {
        source: "/renovace-svetel-praha",
        destination: "/renovace-svetlometu-praha",
        permanent: true,
      },
      {
        source: "/renovace-svetel",
        destination: "/renovace-svetlometu-praha",
        permanent: true,
      },
      {
        source: "/cisteni-svetlometu-praha",
        destination: "/renovace-svetlometu-praha",
        permanent: true,
      },
      {
        source: "/lesteni-svetlometu-praha",
        destination: "/renovace-svetlometu-praha",
        permanent: true,
      },
      {
        source: "/blog/renovace-svetlometu",
        destination: "/blog/renovace-svetlometu-praha-9",
        permanent: true,
      },
      // Časté „uhádnuté“ / staré URL → 404 v GSC
      {
        source: "/detailing-praha",
        destination: "/detailing-praha-9",
        permanent: true,
      },
      {
        source: "/kontakt",
        destination: "/#kontakt",
        permanent: true,
      },
      {
        source: "/cenik",
        destination: "/sluzby",
        permanent: true,
      },
      {
        source: "/ceník",
        destination: "/sluzby",
        permanent: true,
      },
      // Holé cesty bez tokenu = 404 v GSC; tokenové URL zůstávají
      {
        source: "/predani",
        destination: "/",
        permanent: true,
      },
      {
        source: "/faktura",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/brand/logo-razitko.png",
        permanent: true,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/brand/logo-razitko.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
