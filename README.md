# Dr Detailing — portfolio demo

Marketingový web pro detailing studio v Praze. Celá homepage je **scroll-film** (GSAP ScrollTrigger + Lenis).

**Live:** [https://drdetailing.cz](https://drdetailing.cz)

## Co projekt ukazuje

- moderní landing jako jedna filmová scéna při scrollu
- Next.js App Router + TypeScript + Tailwind
- admin zóna (galerie, ceny, poptávky…) — **jen po přihlášení**
- poptávkový formulář přes vlastní API (bez externího mail SaaS)

## Admin

Veřejnost admin neotevře. Přihlášení vyžaduje `ADMIN_USERNAME` + `ADMIN_PASSWORD` v env (na produkci nastaveno). Bez hesla API vrací unauthorized.

## Stack

- Next.js 16, React 19, TypeScript
- GSAP, Lenis, Tailwind CSS 4
- iron-session, Vercel Blob, Zod
- nasazení: Vercel

## Lokální spuštění

```bash
npm install
cp .env.example .env.local
# vyplň ADMIN_USERNAME + ADMIN_PASSWORD
npm run dev
```

Otevři [http://localhost:3020](http://localhost:3020).

## Licence

MIT © Tomáš Kotyza
