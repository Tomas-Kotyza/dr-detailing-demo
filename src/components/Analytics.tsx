"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CookieConsent, readGaConsent, type GaConsent } from "@/components/CookieConsent";

/**
 * GA4 se načte jen když:
 * 1) je nastavené NEXT_PUBLIC_GA_MEASUREMENT_ID (např. G-XXXXXXXX)
 * 2) návštěvník klikne Souhlasím
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const [consent, setConsent] = useState<GaConsent>(null);

  useEffect(() => {
    setConsent(readGaConsent());
  }, []);

  const loadGa = Boolean(gaId && consent === "yes");

  return (
    <>
      {loadGa ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', { analytics_storage: 'granted' });
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      <CookieConsent enabled={Boolean(gaId)} onChange={setConsent} />
    </>
  );
}
