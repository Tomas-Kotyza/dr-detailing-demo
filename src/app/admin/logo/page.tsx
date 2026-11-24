import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLogoPage() {
  return (
    <div>
      <div className="admin-card">
        <h1>Logo</h1>
        <p className="admin-muted">
          Schválené razítko (serif) — Diagnostika, léčba, lesk. Vektor ke
          stažení pro web, tisk a auto.
        </p>
      </div>

      <div className="admin-card" style={{ textAlign: "center" }}>
        <p className="admin-muted" style={{ marginBottom: "1rem" }}>
          Celé logo
        </p>
        <BrandLogo className="h-64 w-auto mx-auto" />
        <div className="admin-actions" style={{ marginTop: "1.25rem", justifyContent: "center" }}>
          <a className="admin-btn" href="/brand/logo.png" download="Dr-Detailing-logo.png">
            Stáhnout PNG
          </a>
          <a className="admin-btn secondary" href="/brand/logo.svg" download="Dr-Detailing-logo.svg">
            Stáhnout SVG
          </a>
        </div>
      </div>

      <div className="admin-card" style={{ textAlign: "center" }}>
        <p className="admin-muted" style={{ marginBottom: "1rem" }}>
          Jen razítko (záložka, auto, nášivka)
        </p>
        <BrandLogo iconOnly className="h-48 w-auto mx-auto" />
        <div className="admin-actions" style={{ marginTop: "1.25rem", justifyContent: "center" }}>
          <a
            className="admin-btn secondary"
            href="/brand/logo-razitko.png"
            download="Dr-Detailing-razitko.png"
          >
            Stáhnout razítko SVG
          </a>
        </div>
      </div>
    </div>
  );
}
