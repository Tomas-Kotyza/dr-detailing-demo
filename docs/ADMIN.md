# Admin zóna Dr Detailing

Adresa: https://drdetailing.cz/admin

## Přihlášení (jako TechnikGO)
Jen **jméno + heslo**. Žádná registrace u Neon / databáze.

Na Vercelu nastavte:
- `ADMIN_USERNAME` — např. `patrik` (když vynecháte, výchozí je `admin`)
- `ADMIN_PASSWORD` — heslo majitele

Volitelně `ADMIN_SESSION_SECRET` (min. 32 znaků). Když chybí, odvodí se z hesla.

## Kde se ukládá obsah
- Výchozí texty jsou v projektu (stejné jako teď na webu).
- Po uložení v adminu se zapisuje do `data/cms.json` (lokálně).
- Na Vercelu (serverless) je disk jen ke čtení — pro **trvalé úpravy na produkci** stačí ve **stejném Vercel projektu** kliknout Storage → Blob → Create. Token `BLOB_READ_WRITE_TOKEN` se doplní sám. To **není nová firma** (žádný Neon) — jen úložiště u účtu, kterým už nasazujete web.

## Co umí
Recenze · Blog · FAQ · Ceník · O mně
