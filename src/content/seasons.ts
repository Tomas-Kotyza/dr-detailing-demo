export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type SeasonCampaign = {
  id: SeasonId;
  label: string;
  /** Krátký štítek u objednávky (např. PODZIM) */
  badge: string;
  title: string;
  body: string;
  /** Id balíčku ve formuláři po kliknutí */
  packId: string;
};

export const defaultSeasonCampaigns: SeasonCampaign[] = [
  {
    id: "spring",
    label: "Jaro",
    badge: "JARO",
    title: "Sůl musí z auta pryč — co nejdřív",
    body: "Po zimě objednejte odsolení a čištění (ideálně s ozonem), nebo alespoň základní vysání interiéru. Čím dřív, tím menší škody na laku i podvozku.",
    packId: "interior",
  },
  {
    id: "summer",
    label: "Léto",
    badge: "LÉTO",
    title: "Léto = UV a horko na laku",
    body: "Před dovolenou nebo dlouhými cestami: leštění a keramická ochrana drží lesk a usnadní mytí. Termín si domluvte v klidu, ne až den před odjezdem.",
    packId: "ceramic1",
  },
  {
    id: "autumn",
    label: "Podzim",
    badge: "PODZIM",
    title: "Podzimní termíny se plní",
    body: "Nenechávejte předvánoční čištění a leštění na poslední chvíli. Objednejte teď — ať auto stihnete před svátky v klidu.",
    packId: "polish",
  },
  {
    id: "winter",
    label: "Zima",
    badge: "ZIMA",
    title: "Posváteční úklid interiéru",
    body: "Po svátcích a rodinných jízdách: kompletní čištění interiéru a dezinfekce ozonem. Vrátíme kabinu do pohody na zbytek zimy.",
    packId: "interior",
  },
];

/** Odhad sezóny z data (ČR: jaro 3–5, léto 6–8, podzim 9–11, zima 12–2). */
export function seasonIdFromDate(d = new Date()): SeasonId {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

export function getSeasonCampaign(
  campaigns: SeasonCampaign[],
  activeId: SeasonId,
): SeasonCampaign {
  return (
    campaigns.find((c) => c.id === activeId) ??
    defaultSeasonCampaigns.find((c) => c.id === activeId) ??
    defaultSeasonCampaigns[0]
  );
}
