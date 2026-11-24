"use client";

import { site } from "@/content/site";

const FILES = {
  telefon: "/brand/vizitka/drdetailing-vizitka-telefon.png",
  tisk: "/brand/vizitka/drdetailing-vizitka-tisk.png",
  sken: "/brand/vizitka/drdetailing-qr-sken.png",
  qr: "/brand/vizitka/drdetailing-qr.png",
  web: "/brand/vizitka/drdetailing-qr-web.png",
} as const;

export default function VizitkaPrintClient() {
  return (
    <div className="vizitka-print-root">
      <div className="vizitka-screen-help admin-card">
        <h1>QR vizitky</h1>
        <p className="admin-muted">
          Stejný princip jako TechnikGO. Zákazník naskenuje kód a telefon nabídne
          uložit kontakt: {site.legalName}, {site.phoneDisplay}, {site.email}.
        </p>
        <ol className="admin-plan-bullets">
          <li>Telefon: ukažte obrázek na displeji, nebo ho pošlete WhatsAppem.</li>
          <li>Tisk: 85 × 55 mm — do tiskárny nebo do copy centra.</li>
          <li>Sken: čistý černobílý QR, kdyby někdo kód špatně četl.</li>
        </ol>
        <div className="admin-actions">
          <button type="button" className="admin-btn" onClick={() => window.print()}>
            Tisknout arch 10 vizitek
          </button>
          <a className="admin-btn secondary" href={FILES.telefon} download="Dr-Detailing-vizitka-telefon.png">
            Stáhnout na telefon
          </a>
          <a className="admin-btn secondary" href={FILES.tisk} download="Dr-Detailing-vizitka-tisk.png">
            Stáhnout tisk 85×55
          </a>
          <a className="admin-btn secondary" href={FILES.sken} download="Dr-Detailing-qr-sken.png">
            Stáhnout QR ke skenu
          </a>
          <a className="admin-btn secondary" href={FILES.qr} download="Dr-Detailing-qr.png">
            Stáhnout QR zelený
          </a>
          <a className="admin-btn secondary" href={FILES.web} download="Dr-Detailing-qr-web.png">
            Stáhnout QR jen web
          </a>
        </div>
      </div>

      <div className="admin-card vizitka-preview">
        <p className="admin-muted">Náhled na telefon</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FILES.telefon} alt="Dr Detailing vizitka na telefon" />
      </div>

      <div className="admin-card vizitka-preview">
        <p className="admin-muted">Náhled tisk 85 × 55 mm</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FILES.tisk} alt="Dr Detailing vizitka k tisku" />
      </div>

      <section className="vizitka-sheet" aria-label="Arch 10 vizitek A4">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="vizitka-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FILES.tisk} alt="" />
          </div>
        ))}
      </section>
    </div>
  );
}
