/** Diskrétní kredit tvůrce webu — odkaz na webaplik.cz */
export function WebaplikCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`webaplik-credit ${className}`.trim()}>
      Web vytvořil{" "}
      <a
        href="https://www.webaplik.cz"
        target="_blank"
        rel="noopener noreferrer"
      >
        WebAplik
      </a>
    </p>
  );
}
