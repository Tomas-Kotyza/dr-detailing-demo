"use client";

import Link from "next/link";
import { useState } from "react";
import {
  googleAdsProposals,
  googleAdsSettings,
  visibilityPlanChecklist,
  visibilityPlanIndexUrls,
  visibilityPlanMeta,
  visibilityPlanSections,
  type GoogleAdsProposal,
} from "@/content/visibility-plan";

async function copyText(label: string, text: string, setFlash: (s: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
    setFlash(`${label}: zkopírováno`);
  } catch {
    setFlash(`${label}: nešlo zkopírovat — označte text ručně`);
  }
}

function CopyBlock({
  label,
  text,
  onCopy,
}: {
  label: string;
  text: string;
  onCopy: (label: string, text: string) => void;
}) {
  return (
    <div className="admin-plan-copy">
      <div className="admin-plan-copy-head">
        <strong>{label}</strong>
        <button type="button" className="admin-btn secondary" onClick={() => onCopy(label, text)}>
          Kopírovat
        </button>
      </div>
      <pre className="admin-plan-pre">{text}</pre>
    </div>
  );
}

function AdsCard({
  proposal,
  onCopy,
}: {
  proposal: GoogleAdsProposal;
  onCopy: (label: string, text: string) => void;
}) {
  const fullText = [
    proposal.name,
    `Rozpočet: ${proposal.budget}`,
    `Klíčová slova: ${proposal.keywords}`,
    `Stránka: ${proposal.landingPage}`,
    "",
    "Nadpisy:",
    ...proposal.headlines.map((h) => `- ${h}`),
    "",
    `Popis: ${proposal.description}`,
    proposal.extensions ? `Prodloužení: ${proposal.extensions}` : "",
    proposal.note ? `Poznámka: ${proposal.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="admin-card admin-plan-ads">
      <div className="admin-promo-head">
        <h2>{proposal.name}</h2>
        <span className="admin-promo-badge">{proposal.badge}</span>
      </div>
      <table className="admin-plan-table">
        <tbody>
          <tr>
            <th>Rozpočet</th>
            <td>{proposal.budget}</td>
          </tr>
          <tr>
            <th>Klíčová slova</th>
            <td>{proposal.keywords}</td>
          </tr>
          <tr>
            <th>Stránka</th>
            <td>
              <a href={proposal.landingPage} target="_blank" rel="noreferrer">
                {proposal.landingPage.replace("https://", "")}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="admin-muted">
        <strong>Nadpisy:</strong> {proposal.headlines.join(" · ")}
      </p>
      <p className="admin-muted">
        <strong>Popis:</strong> {proposal.description}
      </p>
      {proposal.extensions ? (
        <p className="admin-muted">
          <strong>Prodloužení:</strong> {proposal.extensions}
        </p>
      ) : null}
      {proposal.note ? <p className="admin-muted">{proposal.note}</p> : null}
      <button type="button" className="admin-btn" onClick={() => onCopy(proposal.name, fullText)}>
        Kopírovat celý návrh
      </button>
    </div>
  );
}

export default function VisibilityPlanClient() {
  const [flash, setFlash] = useState("");

  function onCopy(label: string, text: string) {
    void copyText(label, text, setFlash);
  }

  return (
    <div className="admin-plan">
      <div className="admin-card">
        <h1>{visibilityPlanMeta.title}</h1>
        <p className="admin-muted">{visibilityPlanMeta.subtitle}</p>
        <p className="admin-muted">
          Propojeno s{" "}
          <Link href="/admin/akce">Akce</Link> — texty pro Maps a recenze jsou tam připravené ke
          kopírování.
        </p>
        {flash ? <p className="admin-muted">{flash}</p> : null}
      </div>

      <div className="admin-card">
        <h2>Letáček k tisku — Profesionální autodetailing</h2>
        <p className="admin-muted">
          A4 = 4 malé letáčky. Přední: plakát. Zadní: sleva 5&nbsp;% na další
          službu + kontakt (kód PROLETAR5).
        </p>
        <div className="admin-flyer-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/akce/proletarska-detailace.png"
            alt="Náhled letáčku Profesionální autodetailing"
          />
        </div>
        <div className="admin-actions">
          <Link className="admin-btn" href="/admin/plan/letacek">
            Otevřít a tisknout
          </Link>
        </div>
      </div>

      <div className="admin-card admin-plan-checklist">
        <h2>Rychlý checklist</h2>
        <ul className="admin-plan-checks">
          {visibilityPlanChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button
          type="button"
          className="admin-btn secondary"
          onClick={() => onCopy("Checklist", visibilityPlanChecklist.map((i) => `□ ${i}`).join("\n"))}
        >
          Kopírovat checklist
        </button>
      </div>

      {visibilityPlanSections.map((section) => (
        <div key={section.id} className="admin-card">
          <h2>{section.title}</h2>
          {section.intro ? <p className="admin-muted">{section.intro}</p> : null}
          {section.bullets ? (
            <ul className="admin-plan-bullets">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <table className="admin-plan-table">
              <tbody>
                {section.table.map((row) => (
                  <tr key={row.label}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {section.copyBlocks?.map((block) => (
            <CopyBlock key={block.id} label={block.label} text={block.text} onCopy={onCopy} />
          ))}
        </div>
      ))}

      <div className="admin-card">
        <h2>Google Ads — 3 návrhy</h2>
        <p className="admin-muted">{googleAdsSettings.intro}</p>
        <ul className="admin-plan-bullets">
          {googleAdsSettings.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="admin-muted">
          <strong>Pořadí spuštění:</strong> {googleAdsSettings.order.join(" → ")}
        </p>
        <p className="admin-muted">
          {googleAdsSettings.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 ? " · " : null}
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </span>
          ))}
        </p>
      </div>

      <div className="admin-plan-ads-stack">
        {googleAdsProposals.map((p) => (
          <AdsCard key={p.id} proposal={p} onCopy={onCopy} />
        ))}
      </div>

      <div className="admin-card">
        <h2>Stránky ke kontrole ve Search Console</h2>
        <p className="admin-muted">
          Jednou měsíčně: Inspekce URL → zelené „URL je v indexu Google“. Pozor:{" "}
          <code>lesteni-laku-praha-9</code> neexistuje — blog je pod{" "}
          <code>/blog/lesteni-laku-praha-9</code>.
        </p>
        <ul className="admin-plan-urls">
          {visibilityPlanIndexUrls.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {url.replace("https://", "")}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="admin-btn secondary"
          onClick={() => onCopy("URL pro Search Console", visibilityPlanIndexUrls.join("\n"))}
        >
          Kopírovat všechny URL
        </button>
      </div>

      <div className="admin-card">
        <h2>Realistická očekávání</h2>
        <table className="admin-plan-table">
          <tbody>
            <tr>
              <th>1–4 týdny</th>
              <td>Google přepočítá stránky, pozice se může hýbat</td>
            </tr>
            <tr>
              <th>1–3 měsíce</th>
              <td>S recenzemi a Maps aktivitou posun na 1. stránku</td>
            </tr>
            <tr>
              <th>Průběžně</th>
              <td>Bez recenzí a aktivity na Maps pozice klesají</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
