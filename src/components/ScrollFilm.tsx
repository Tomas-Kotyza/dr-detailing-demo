"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { beforeAfterSlide, filmBeats, packages, site, vehicles } from "@/content/site";
import { BrandLogo } from "@/components/BrandLogo";
import { WebaplikCredit } from "@/components/WebaplikCredit";
import { FilmJumpNav } from "@/components/FilmJumpNav";
import { ReviewsSlider } from "@/components/ReviewsSlider";
import { BlogTeaser } from "@/components/BlogTeaser";
import { PriceListInteractive } from "@/components/PriceListInteractive";
import { BeforeAfterCompare } from "@/components/BeforeAfterCompare";
import type {
  BlogPostItem,
  PriceItem,
  PromoItem,
  ReviewItem,
} from "@/lib/content/types";
import type { SeasonCampaign } from "@/content/seasons";
import type { HomepageWorkItem } from "@/lib/cms/gallery";
import { scrubVideoTo, seekVideoEnd } from "@/lib/filmScroll";
import {
  loadVideoSrc,
  primeVideoForScrub,
  waitForVideoMetadata,
} from "@/lib/filmVideo";
import { useFilmMobile } from "@/hooks/useFilmMobile";
import { HomeWorkGallery } from "@/components/HomeWorkGallery";
import { StickyOrderBar } from "@/components/StickyOrderBar";
import {
  goToOrder,
  ORDER_PACK_EVENT,
  resolveOrderPackId,
  whatsappOrderUrl,
} from "@/lib/orderIntent";

gsap.registerPlugin(ScrollTrigger);

function formatPrice(n: number) {
  return new Intl.NumberFormat("cs-CZ").format(n);
}

/** Pojistka: text/ceník nikdy nezůstane na opacity 0. */
function ensureVisible(el: HTMLElement | null, delayMs = 2200) {
  if (!el) return () => {};
  const id = window.setTimeout(() => {
    const op = Number(gsap.getProperty(el, "opacity"));
    if (op < 0.4) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
    }
  }, delayMs);
  return () => window.clearTimeout(id);
}

/**
 * Scroll-film + obsah pod ním (recenze, blog):
 * 1 Leštění → 2 Práce + ceník → 3 Objednávka → Recenze → Blog
 */
export function ScrollFilm({
  priceItems,
  reviews,
  blogPosts,
  workItems = [],
  promos = [],
  season = null,
}: {
  priceItems: PriceItem[];
  reviews: ReviewItem[];
  blogPosts: BlogPostItem[];
  workItems?: HomepageWorkItem[];
  promos?: PromoItem[];
  season?: SeasonCampaign | null;
}) {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);
    // Mobil: address-bar resize spouští churn — refresh hlavně při orientaci
    window.addEventListener("orientationchange", refresh);
    const t1 = window.setTimeout(refresh, 700);
    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.clearTimeout(t1);
    };
  }, []);

  const proofReview =
    reviews.find((r) => String(r.role).toLowerCase() === "customer") ??
    reviews.find((r) => !String(r.role).toLowerCase().includes("owner")) ??
    reviews[0] ??
    null;
  const featuredPromo = promos[0] ?? null;

  return (
    <div className="film-root text-[var(--fg)]">
      <div className="film-brand">
        <a href="/" className="film-brand-link" aria-label="Dr Detailing — úvod">
          <BrandLogo
            priority
            className="h-24 w-auto md:h-32"
          />
        </a>
        <FilmJumpNav />
      </div>
      <button type="button" className="film-cta" onClick={() => goToOrder()}>
        Rezervovat
      </button>
      <ChapterOpen />
      <ChapterWork priceItems={priceItems} workItems={workItems} />
      <ChapterOrder
        proofReview={proofReview}
        featuredPromo={featuredPromo}
        season={season}
      />
      <HomeSeoBridge />
      <ReviewsSlider reviews={reviews} />
      <BlogTeaser posts={blogPosts} />
      <SiteFooter />
      <StickyOrderBar />
    </div>
  );
}

/** Krátký SEO most pod filmem — detailing Praha + rozleštění / cena. */
function HomeSeoBridge() {
  return (
    <section className="after-film" aria-label="Detailing Praha — služby">
      <div className="after-film-inner max-w-2xl">
        <p className="svc-label">Detailing Praha</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Studio Praha&nbsp;9 — leštění a rozleštění laku
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
          {site.heroLead}
        </p>
        <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
          Rozleštění laku od 9&nbsp;600&nbsp;Kč. Ceny a časté otázky najdete na{" "}
          <Link href="/lesteni-laku-praha" className="font-semibold text-[var(--accent)]">
            leštění laku Praha
          </Link>
          {" · "}
          <Link
            href="/blog/rozlesteni-laku-cena"
            className="font-semibold text-[var(--accent)]"
          >
            rozleštění laku — cena
          </Link>
          {" · "}
          <Link href="/detailing-praha-9" className="font-semibold text-[var(--accent)]">
            detailing Praha 9
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer id="kontakt" className="site-footer" aria-label="Patička webu">
      <div className="after-film-inner">
        <p className="svc-label">Kontakt</p>
        <BrandLogo className="h-36 w-auto md:h-40" />
        <p className="mt-4 text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--fg)]">Provozovna</span>
          <br />
          {site.address}
          <br />
          {site.place}
        </p>
        <a href={`tel:${site.phone}`} className="mt-3 block font-semibold text-[var(--accent)]">
          {site.phoneDisplay}
        </a>
        <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-[var(--muted)]">
          {site.email}
        </a>
        <div className="footer-cols mt-8">
          <nav className="footer-col" aria-label="Navigace webu">
            <p className="footer-col-title">Na webu</p>
            <div className="footer-col-links">
              <Link href="/sluzby">Služby</Link>
              <Link href="/lesteni-laku-praha">Leštění / rozleštění laku Praha</Link>
              <Link href="/blog/rozlesteni-laku-cena">Rozleštění laku — cena</Link>
              <Link href="/keramicka-ochrana-praha">Keramická ochrana</Link>
              <Link href="/cisteni-interieru-praha">Čištění interiéru</Link>
              <Link href="/renovace-svetlometu-praha">Renovace světlometů</Link>
              <Link href="/galerie">Galerie</Link>
              <Link href="/o-mne">O mně</Link>
              <Link href="/faq">Časté otázky</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/obchodni-podminky">Obchodní podmínky</Link>
              <Link href="/ochrana-udaju">Ochrana osobních údajů</Link>
            </div>
          </nav>
          <details className="footer-col footer-pusobeni">
            <summary className="footer-pusobeni-btn">Působení</summary>
            <nav className="footer-pusobeni-panel" aria-label="Působení — města a okolí">
              <p className="footer-col-note">
                Studio Horní Počernice · dojezd a svoz v okolí
              </p>
              <div className="footer-col-links">
                <Link href="/detailing-praha-9">Praha 9</Link>
                <Link href="/detailing-praha-10">Praha 10</Link>
                <Link href="/detailing-brandys-nad-labem">Brandýs nad Labem</Link>
                <Link href="/detailing-stara-boleslav">Stará Boleslav</Link>
                <Link href="/detailing-uvaly">Úvaly</Link>
                <Link href="/detailing-klanovice">Klánovice</Link>
                <Link href="/detailing-ujezd-nad-lesy">Újezd nad Lesy</Link>
                <Link href="/detailing-radonice">Radonice</Link>
                <Link href="/detailing-lysa-nad-labem">Lysá nad Labem</Link>
                <Link href="/detailing-milovice">Milovice</Link>
                <Link href="/detailing-cesky-brod">Český Brod</Link>
                <Link href="/detailing-kostelec-nad-cernymi-lesy">
                  Kostelec n. Č. lesy
                </Link>
              </div>
            </nav>
          </details>
        </div>
        <div className="footer-end-note">
          <p className="footer-ico-line">
            <span className="font-semibold text-[var(--fg)]">{site.legalName}</span>
            <br />
            IČO {site.ico}
          </p>
          <p className="mt-2">Sídlo: {site.registeredAddress}</p>
          <p className="mt-3">
            ©{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            {site.brandName} · detailing Praha 9
          </p>
          <WebaplikCredit className="mt-3" />
          <p className="footer-admin-link mt-3">
            <Link href="/admin">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Kapitola 1 — ZAMČENO dle referenčního videa (WhatsApp 2026-07-27):
 * dva technici leští celé auto; desktop scroll scrubuje video.
 * Mobil: video se samo přehraje (bez pinu a bez ovládání scrollu).
 * Desktop: scroll scrubuje leštění kapoty/předku → odchod → freeze.
 */
const HERO_VIDEO = "/film/polish-people.mp4?v=16";
const HERO_VIDEO_MOBILE = "/film/polish-people-mobile.mp4?v=16";
/** Startovní poster — ať při náběhu neproblikne konec. */
const HERO_POSTER_START = "/film/polish-hero-start.jpg";
/** Menší webp — mobilní LCP */
const HERO_POSTER_START_MOBILE = "/film/polish-hero-start-mobile.webp";
const HERO_POSTER_END_MOBILE = "/film/polish-hero-end-mobile.webp";
/** Celý clip včetně zpomaleného odchodu — freeze až úplně na konci. */
const HERO_PLAY_SHARE = 0.99;

function ChapterOpen() {
  const isMobile = useFilmMobile();
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const endFreezeRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;

    if (!mobile) {
      // Poster až po potvrzení desktopu — jinak mobil stahuje 98 KB JPG při hydrataci.
      video.poster = HERO_POSTER_START;
      video.preload = "auto";
      video.src = HERO_VIDEO;
      video.load();
      setHeroVideoReady(true);
      return;
    }

    // Mobil: žádný pin ani scroll-film — video se jen samo pustí.
    // LCP = lehký webp poster (~30 KB). Video (~2,8 MB) až po idle, ať LCP není <video>.
    let cancelled = false;
    let started = false;
    let idleId: number | undefined;
    let delayId: number | undefined;
    const copy = copyRef.current;
    const hint = hintRef.current;
    const endFreeze = endFreezeRef.current;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.preload = "none";
    video.removeAttribute("poster");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");

    if (endFreeze) gsap.set(endFreeze, { opacity: 0 });
    if (copy) gsap.set(copy, { opacity: 1, y: 0 });
    if (hint) gsap.set(hint, { opacity: 0.55 });

    const tryPlay = () => {
      if (cancelled) return;
      video.muted = true;
      void video.play().catch(() => {});
    };

    const startMobileVideo = () => {
      if (cancelled || started) return;
      started = true;
      video.preload = "metadata";
      video.autoplay = true;
      void loadVideoSrc(video, HERO_VIDEO_MOBILE)
        .then(() => {
          if (cancelled) return;
          setHeroVideoReady(true);
          tryPlay();
        })
        .catch(() => {
          if (!cancelled) setHeroVideoReady(true);
        });
    };

    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      idleId = ric(() => startMobileVideo(), { timeout: 2200 });
    } else {
      delayId = window.setTimeout(startMobileVideo, 900);
    }

    const onTouch = () => {
      startMobileVideo();
      tryPlay();
    };
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      cancelled = true;
      if (idleId != null && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
      if (delayId != null) window.clearTimeout(delayId);
      window.removeEventListener("touchstart", onTouch);
      try {
        video.pause();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Desktop: klasický scroll-scrub
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches || !heroVideoReady) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    const endFreeze = endFreezeRef.current;
    const copy = copyRef.current;
    const hint = hintRef.current;
    if (!root || !pin || !video || !endFreeze || !copy || !hint) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | null = null;
    let cancelled = false;
    let clearSafety: (() => void) | undefined;

    const showEnd = () => {
      seekVideoEnd(video);
      gsap.set(endFreeze, { opacity: 1 });
    };
    const hideEnd = () => gsap.set(endFreeze, { opacity: 0 });

    const boot = async () => {
      await waitForVideoMetadata(video);
      if (cancelled) return;
      await primeVideoForScrub(video);
      if (cancelled) return;

      if (reduce) {
        showEnd();
        gsap.set(copy, { opacity: 1, y: 0 });
        gsap.set(hint, { opacity: 0 });
        return;
      }

      const duration =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 4.5;
      const playUntil = Math.max(0, duration - 0.04);
      gsap.set(copy, { opacity: 0, y: 24 });
      gsap.set(hint, { opacity: 0.65 });
      gsap.set(endFreeze, { opacity: 0 });
      clearSafety = ensureVisible(copy, 4000);

      ctx = gsap.context(() => {
        const scrollEnd = "+=180%";

        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: scrollEnd,
          pin: pin,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= HERO_PLAY_SHARE) {
              showEnd();
              return;
            }
            hideEnd();
            scrubVideoTo(video, (self.progress / HERO_PLAY_SHARE) * playUntil);
          },
          onLeave: showEnd,
          onLeaveBack: () => {
            hideEnd();
            video.currentTime = 0;
          },
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: scrollEnd,
              scrub: true,
            },
          })
          .to(hint, { opacity: 0, ease: "none", duration: 0.1 }, 0.02)
          .to(copy, { opacity: 1, y: 0, ease: "none", duration: 0.22 }, 0.4);

        ScrollTrigger.refresh();
      }, root);
    };

    void boot();
    return () => {
      cancelled = true;
      clearSafety?.();
      ctx?.revert();
    };
  }, [heroVideoReady]);

  return (
    <section ref={rootRef} className="chapter chapter-open" aria-label="Kapitola 1 — Úvod">
      <div ref={pinRef} className="film-pin">
        <div className="film-stage">
          <div className="film-media-stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_POSTER_START_MOBILE}
              alt=""
              className={`film-poster-lcp md:hidden${heroVideoReady ? " film-poster-lcp--hide" : ""}`}
              fetchPriority="high"
              decoding="async"
              aria-hidden
            />
            <video
              ref={videoRef}
              className={`film-media film-media--bright${isMobile && !heroVideoReady ? " film-media--pending" : ""}`}
              muted
              playsInline
              preload="none"
            />
            {/* Freeze spoileru — pojistka, když scrub nedojede */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={endFreezeRef}
              src={HERO_POSTER_END_MOBILE}
              alt=""
              className="film-end-freeze"
              loading="lazy"
              decoding="async"
              aria-hidden
            />
          </div>
          <div className="film-grade film-grade--hero" aria-hidden />
          <div ref={copyRef} className="film-copy">
            <h1 className="sr-only">
              Detailing Praha — {site.brandName}, leštění a rozleštění laku
            </h1>
            <p className="font-display text-4xl font-extrabold tracking-[0.04em] md:text-6xl lg:text-7xl">
              {site.brandLeft}
              <span className="text-[var(--accent)]"> {site.brandRight}</span>
            </p>
            <p className="mt-4 max-w-md text-base text-[var(--muted)] md:text-lg">{site.tagline}</p>
          </div>
          <p ref={hintRef} className="film-scroll-hint">
            Scroll — před a po
          </p>
        </div>
      </div>
    </section>
  );
}

/* ——— 2 Před/po → čištění interiéru → ceník → naše práce ——— */
function ChapterWork({
  priceItems,
  workItems,
}: {
  priceItems: PriceItem[];
  workItems: HomepageWorkItem[];
}) {
  return (
    <>
      <section id="pred-a-po" className="ba-section" aria-label="Před a po">
        <div className="ba-section-wrap">
          <p className="svc-label">{beforeAfterSlide.label}</p>
          <h2 className="font-display text-3xl font-bold">{beforeAfterSlide.title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{beforeAfterSlide.text}</p>
          <BeforeAfterCompare slides={beforeAfterSlide.slides} layout="section" />
        </div>
      </section>

      <InteriorScene />

      <section id="cenik" className="price-section" aria-label="Ceník">
        <div className="price-section-wrap">
          <PriceListInteractive items={priceItems} layout="section" />
        </div>
      </section>

      <HomeWorkGallery items={workItems} />
    </>
  );
}

function InteriorScene() {
  const beat = filmBeats[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = mobile ? beat.mobileVideo : beat.video;
    video.load();

    const play = () => {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      void video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [beat.mobileVideo, beat.video]);

  return (
    <section className="interior-scene" aria-label="Čištění interiéru">
      <video
        ref={videoRef}
        className="film-media film-media--bright"
        muted
        playsInline
        loop
        preload="metadata"
        poster={beat.poster}
      />
      <div className="film-grade film-grade--readable" aria-hidden />
      <div className="svc-copy">
        <p className="svc-label">{beat.label}</p>
        <h2 className="font-display text-3xl font-bold md:text-5xl">{beat.title}</h2>
        <p className="svc-copy-text">{beat.text}</p>
        <p className="mt-2 font-display text-2xl font-bold text-[var(--accent)] md:text-3xl">
          {beat.price}
        </p>
      </div>
    </section>
  );
}

function ChapterOrder({
  proofReview,
  featuredPromo,
  season,
}: {
  proofReview: ReviewItem | null;
  featuredPromo: PromoItem | null;
  season: SeasonCampaign | null;
}) {
  const [vehicle, setVehicle] = useState<string>("SUV");
  const [packId, setPackId] = useState<string>("polish");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const pack = packages.find((p) => p.id === packId) ?? packages[1];
  const canSubmit = acceptTerms && acceptPrivacy && !sending;

  useEffect(() => {
    function applyPack(raw?: string | null) {
      const resolved = resolveOrderPackId(raw);
      if (resolved) setPackId(resolved);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      applyPack(params.get("pack"));
    } catch {
      /* ignore */
    }

    function onPack(e: Event) {
      const detail = (e as CustomEvent<{ packId?: string }>).detail;
      applyPack(detail?.packId);
    }

    window.addEventListener(ORDER_PACK_EVENT, onPack);
    return () => window.removeEventListener(ORDER_PACK_EVENT, onPack);
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!acceptTerms || !acceptPrivacy || sending) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          vehicle,
          packName: pack.name,
          packPrice: pack.price,
          acceptTerms,
          acceptPrivacy,
          company,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Odeslání selhalo. Zkuste to znovu nebo zavolejte.");
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Odeslání selhalo. Zkontrolujte připojení nebo zavolejte.");
    } finally {
      setSending(false);
    }
  }

  const waUrl = whatsappOrderUrl(
    `Dobrý den, rád/a bych termín: ${pack.name} (${vehicle}) u ${site.brandName}.`,
  );

  return (
    <section id="objednat" className="chapter-order" aria-label="Kapitola 3 — Objednávka">
      {/* Pozadí jen desktop — na mobilu stačí barva, méně stahování */}
      <Image
        src="/film/ceramic-start.webp"
        alt=""
        fill
        className="order-bg hidden md:block"
        sizes="100vw"
        loading="lazy"
        aria-hidden
      />
      <div className="order-veil" aria-hidden />
      <div className="order-inner">
        <p className="svc-label">Objednávka</p>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          Domluvte si termín
        </h2>
        <p className="order-promise mt-3">
          Ozveme se do 24&nbsp;h · bez závazku · svoz po domluvě
        </p>
        <div className="process-row mt-3" aria-hidden>
          {site.process.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              {i > 0 ? <span className="process-arrow">→</span> : null}
              <span className="process-step">{step}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 max-w-lg text-[var(--muted)]">{site.priceNote}</p>

        {season ? (
          <button
            type="button"
            className="order-season"
            onClick={() => goToOrder(season.packId)}
          >
            <span className="order-promo-badge">{season.badge}</span>
            <span className="order-promo-title">{season.title}</span>
            <span className="order-promo-line">{season.body}</span>
          </button>
        ) : null}

        {featuredPromo ? (
          <button
            type="button"
            className="order-promo"
            onClick={() =>
              goToOrder(
                featuredPromo.id.includes("svetlomet")
                  ? "polish"
                  : featuredPromo.id.includes("ozon")
                    ? "ozone"
                    : "polish",
              )
            }
          >
            <span className="order-promo-badge">Aktuálně</span>
            <span className="order-promo-title">{featuredPromo.title}</span>
            <span className="order-promo-line">{featuredPromo.offerLine}</span>
          </button>
        ) : (
          <div className="order-promo order-promo-empty" aria-live="polite">
            <span className="order-promo-badge">Aktuálně</span>
            <span className="order-promo-title">Žádná probíhající akce</span>
            <span className="order-promo-line">
              Speciální nabídky se tu objeví, jakmile budou k dispozici.
            </span>
          </div>
        )}

        {proofReview ? (
          <blockquote className="order-proof">
            <p>„{proofReview.text}“</p>
            <footer>
              {proofReview.name}
              {proofReview.car ? ` · ${proofReview.car}` : null}
            </footer>
          </blockquote>
        ) : null}

        {sent ? (
          <div className="order-sent mt-6" role="status">
            <h3 className="font-display text-2xl font-bold">Poptávka odeslána</h3>
            <p className="mt-2 text-[var(--muted)]">
              Díky. Máme ji uloženou a ozveme se vám co nejdřív — obvykle telefonem.
            </p>
            <div className="order-sent-actions mt-6">
              <a className="btn-secondary" href={`tel:${site.phone}`}>
                Zavolat {site.phoneDisplay}
              </a>
              <a
                className="btn-primary"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Napsat na WhatsApp
              </a>
            </div>
            <button
              type="button"
              className="order-sent-back mt-6"
              onClick={() => {
                setSent(false);
                setName("");
                setPhone("");
                setAcceptTerms(false);
                setAcceptPrivacy(false);
                setError("");
              }}
            >
              Poslat další poptávku
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="order-form mt-6">
            <fieldset>
              <legend>Vozidlo</legend>
              <div className="chip-grid">
                {vehicles.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`chip ${vehicle === v ? "active" : ""}`}
                    onClick={() => setVehicle(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend>Služba</legend>
              <div className="pack-list">
                {packages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`pack-row ${packId === p.id ? "active" : ""}`}
                    onClick={() => setPackId(p.id)}
                  >
                    <span>
                      <span className="block font-semibold">{p.name}</span>
                      {p.hint ? (
                        <span className="mt-1 block text-xs text-[var(--muted)]">{p.hint}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-[var(--accent)]">
                      od {formatPrice(p.price)} Kč
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="field">
                Jméno *
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field">
                Telefon *
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
            </div>

            {/* Honeypot — skryté pro lidi */}
            <label className="order-hp" aria-hidden="true">
              Firma
              <input
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>

            <div className="consent-list mt-6">
              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>
                  Souhlasím s{" "}
                  <Link href="/obchodni-podminky" target="_blank" rel="noopener noreferrer">
                    obchodními podmínkami
                  </Link>
                  .
                </span>
              </label>
              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  required
                />
                <span>
                  Souhlasím se{" "}
                  <Link href="/ochrana-udaju" target="_blank" rel="noopener noreferrer">
                    zpracováním osobních údajů
                  </Link>{" "}
                  (GDPR).
                </span>
              </label>
            </div>

            {error ? <p className="order-form-error mt-4">{error}</p> : null}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">
                {vehicle} · {pack.name} · od {formatPrice(pack.price)} Kč
              </p>
              <button type="submit" className="btn-primary" disabled={!canSubmit}>
                {sending ? "Odesílám…" : "Odeslat poptávku"}
              </button>
            </div>

            <p className="order-alt-contact">
              Nebo rovnou volejte{" "}
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              {" · "}
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
