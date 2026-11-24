import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Lenis + ScrollTrigger — bez toho scrub trhá. */
export function bindLenisScroll(lenis: Lenis) {
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? "transform" : "fixed",
  });

  const onRefresh = () => lenis.resize();
  ScrollTrigger.addEventListener("refresh", onRefresh);
  return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
}

export function scrubVideoTo(video: HTMLVideoElement, time: number) {
  if (!Number.isFinite(time) || time < 0) return;
  const duration =
    Number.isFinite(video.duration) && video.duration > 0 ? video.duration : time;
  // Těsně před EOF — včetně odchodu leštiče od kapoty
  const maxSeek = Math.max(0, duration - 0.04);
  const next = Math.min(Math.max(0, time), maxSeek);
  if (Math.abs(video.currentTime - next) > 0.012) {
    video.currentTime = next;
  }
}

/** Finále: auto bez leštiče (už odešel od kapoty). */
export function seekVideoEnd(video: HTMLVideoElement) {
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  video.currentTime = Math.max(0, duration - 0.04);
}

/** Scroll délka pin scény. */
export function filmScrollLength(durationSec: number, minPercent = 280) {
  return `+=${Math.max(minPercent, Math.round(durationSec * 70))}%`;
}
