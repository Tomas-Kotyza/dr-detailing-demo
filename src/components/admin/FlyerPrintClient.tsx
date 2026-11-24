"use client";

import Link from "next/link";
import { site } from "@/content/site";

const POSTER = "/akce/proletarska-detailace.png";

function BackFace() {
  return (
    <div className="flyer-back-face">
      <p className="flyer-brand">
        DR <span>DETAILING</span>
      </p>
      <div className="flyer-offer">
        <div className="flyer-pct">
          5%<small>SLEVA</small>
        </div>
        <p className="flyer-offer-title">na další službu</p>
        <p className="flyer-offer-sub">
          Ukažte tento letáček při objednávce. Platí na leštění laku, keramiku,
          interiér i renovaci světel.
        </p>
        <span className="flyer-code">KÓD: PROLETAR5</span>
      </div>
      <div className="flyer-contact">
        <strong>Kontakt</strong>
        {site.phoneDisplay}
        <br />
        {site.email}
        <br />
        {site.address}
        <br />
        Praha 9 · {site.domain}
      </div>
    </div>
  );
}

export default function FlyerPrintClient() {
  return (
    <div className="flyer-print-root">
      <div className="flyer-screen-help admin-card">
        <p className="admin-muted" style={{ marginTop: 0 }}>
          <Link href="/admin/plan">← Zpět na Plán reklama a viditelnost</Link>
        </p>
        <h1>Letáček A4 — 4× A6</h1>
        <p className="admin-muted">
          Přední: plakát Profesionální autodetailing. Zadní: sleva 5&nbsp;% + kontakt.
          Vytiskněte oboustranně, pak rozřežte.
        </p>
        <ol className="admin-plan-bullets">
          <li>Klikněte Tisknout (nebo Ctrl+P).</li>
          <li>Formát A4, okraje žádné / minimální.</li>
          <li>Oboustranně: převrátit podle dlouhé strany.</li>
        </ol>
        <button type="button" className="admin-btn" onClick={() => window.print()}>
          Tisknout
        </button>
      </div>

      <section className="flyer-sheet flyer-sheet-front" aria-label="Přední strana">
        <div className="flyer-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flyer-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="flyer-front-face"
                src={POSTER}
                alt="Profesionální autodetailing — Dr Detailing"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flyer-sheet flyer-sheet-back" aria-label="Zadní strana">
        <div className="flyer-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flyer-cell">
              <BackFace />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
