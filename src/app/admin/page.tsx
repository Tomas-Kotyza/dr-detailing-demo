import Link from "next/link";
import { site } from "@/content/site";
import { adminAuthConfigured } from "@/lib/auth/session";
import { cmsWritableHint } from "@/lib/cms/store";
import { inquiryEmailConfigured } from "@/lib/mail/notify";

export default function AdminHomePage() {
  const authOk = adminAuthConfigured();
  const store = cmsWritableHint();
  const mailOk = inquiryEmailConfigured();

  return (
    <div>
      <div className="admin-card">
        <h1>Přehled</h1>
        <p className="admin-muted">
          Přihlášení jménem a heslem (jako TechnikGO). Žádná registrace u Neon ani
          jiné databáze.
        </p>
        {!authOk ? (
          <p className="admin-error">
            Na Vercelu nastavte <code>ADMIN_USERNAME</code> a{" "}
            <code>ADMIN_PASSWORD</code>.
          </p>
        ) : (
          <p className="admin-muted">
            Přihlášení je nastavené. Úložiště:{" "}
            {store === "blob"
              ? "Vercel Blob (produkce — ukládání funguje)"
              : "soubor data/cms.json (lokálně). Na Vercelu musí být BLOB_READ_WRITE_TOKEN."}
          </p>
        )}
        <p className="admin-muted">
          E-mail při nové poptávce:{" "}
          {mailOk
            ? "SMTP schránka nastavená — majitel dostane upozornění"
            : "zatím vypnuto (chybí SMTP_HOST / SMTP_USER / SMTP_PASS na Vercelu)"}
        </p>
      </div>

      <div className="admin-grid">
        <Link className="admin-link-card" href="/admin/poptavky">
          <strong>Poptávky</strong>
          <span className="admin-muted">
            Z formuláře na webu — jméno, telefon, služba
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/galerie">
          <strong>Galerie</strong>
          <span className="admin-muted">
            Fotky práce — zásobník a 2 sety po 3 na úvod
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/predavaci-list">
          <strong>Předávací list</strong>
          <span className="admin-muted">
            Digitální podpis, tisk, WhatsApp / e-mail / SMS
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/faktury">
          <strong>Faktury</strong>
          <span className="admin-muted">
            Historie, zákazníci, položky — {site.brandName} / {site.legalName}
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/plan">
          <strong>Plán reklama a viditelnost</strong>
          <span className="admin-muted">
            Recenze, Maps, Google Ads — co dělat týdně a měsíčně
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/akce">
          <strong>Akce</strong>
          <span className="admin-muted">
            Tvoje nabídky u objednávky — zapni Aktivní, až budeš chtít na web
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/sezona">
          <strong>Sezóna</strong>
          <span className="admin-muted">
            Jaro / léto / podzim / zima — výzva u objednávky
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/novinky">
          <strong>Novinky</strong>
          <span className="admin-muted">
            Sezóna, popup, ebook — jen náhled, spustíme spolu
          </span>
        </Link>
        <Link className="admin-link-card" href="/admin/reviews">
          <strong>Recenze</strong>
          <span className="admin-muted">Slovo majitele a recenze zákazníků</span>
        </Link>
        <Link className="admin-link-card" href="/admin/blog">
          <strong>Blog</strong>
          <span className="admin-muted">Články a SEO texty</span>
        </Link>
        <Link className="admin-link-card" href="/admin/faq">
          <strong>FAQ</strong>
          <span className="admin-muted">Časté otázky</span>
        </Link>
        <Link className="admin-link-card" href="/admin/prices">
          <strong>Ceník</strong>
          <span className="admin-muted">Položky a co obsahuje cena</span>
        </Link>
        <Link className="admin-link-card" href="/admin/about">
          <strong>O mně</strong>
          <span className="admin-muted">Text stránky /o-mne</span>
        </Link>
        <Link className="admin-link-card" href="/admin/logo">
          <strong>Logo</strong>
          <span className="admin-muted">Vektor ke stažení — razítko a celé logo</span>
        </Link>
        <Link className="admin-link-card" href="/admin/vizitka">
          <strong>QR vizitky</strong>
          <span className="admin-muted">Telefon, tisk 85×55 mm, uložit kontakt</span>
        </Link>
        <a className="admin-link-card" href="/" target="_blank" rel="noreferrer">
          <strong>Otevřít web</strong>
          <span className="admin-muted">Veřejná homepage</span>
        </a>
      </div>
    </div>
  );
}
