/** Mobilní viewport — menší preload, odložené video. */
export function isMobileFilmViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function scheduleIdle(
  cb: () => void,
  timeoutMs = 2500,
): ReturnType<typeof setTimeout> {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(cb, { timeout: timeoutMs }) as unknown as ReturnType<
      typeof setTimeout
    >;
  }
  return setTimeout(cb, timeoutMs);
}

export function cancelIdle(id: ReturnType<typeof setTimeout>) {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    window.cancelIdleCallback(id as unknown as number);
  } else {
    clearTimeout(id);
  }
}

export function waitForVideoMetadata(
  video: HTMLVideoElement,
  timeoutMs = 8000,
): Promise<void> {
  if (video.readyState >= 1) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    video.addEventListener("loadedmetadata", done, { once: true });
    // iOS / preload=none — bez load() metadata nikdy nepřijdou
    try {
      video.load();
    } catch {
      /* ignore */
    }
    // pojistka, ať boot neskončí viset navždy
    window.setTimeout(() => resolve(), timeoutMs);
  });
}

/** iOS potřebuje play→pause, jinak scrub currentTime neukáže snímky. */
export async function primeVideoForScrub(video: HTMLVideoElement) {
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  try {
    const p = video.play();
    if (p) await p;
  } catch {
    /* autoplay policy — zkusíme aspoň seek */
  }
  video.pause();

  try {
    video.currentTime = 0.001;
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      video.addEventListener("seeked", done, { once: true });
      window.setTimeout(done, 400);
    });
  } catch {
    /* ignore */
  }
  video.currentTime = 0;
}

/** Nastaví src a počká na metadata — pro odložené načtení na mobilu. */
export async function loadVideoSrc(video: HTMLVideoElement, src: string) {
  const bare = src.split("?")[0]!;
  const current = video.getAttribute("src") ?? video.currentSrc;
  const already = Boolean(current && current.includes(bare));

  if (!already) {
    video.src = src;
  }

  // Vždy load() — na mobilu s preload=none jinak readyState zůstane 0
  video.load();
  await waitForVideoMetadata(video);
}

export function videoPreload(isMobile: boolean, role: "hero" | "below-fold"): "auto" | "metadata" | "none" {
  if (isMobile) return role === "hero" ? "metadata" : "none";
  return "auto";
}
