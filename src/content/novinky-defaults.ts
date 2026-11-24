import type { EbookConfig, LeadPopupConfig } from "@/lib/cms/types";

export const defaultLeadPopup: LeadPopupConfig = {
  title: "5 % na další službu",
  body: "Zadejte jméno a e-mail — pošleme kód slevy a tipy k péči o lak. Bez spamu, odhlásit můžete kdykoli.",
  discountLabel: "Kód po potvrzení e-mailu · platí na další objednávku",
  buttonLabel: "Chci slevu a tipy",
  delaySeconds: 20,
};

export const defaultEbook: EbookConfig = {
  title: "Jak pečovat o lak a interiér auta",
  subtitle:
    "Krátký průvodce od Dr Detailing — praktické tipy mezi návštěvami studia v Horních Počernicích.",
  chapters: [
    {
      heading: "1. Mytí bez škrábanců",
      paragraphs: [
        "Nejdřív opláchněte sůl a prach proudem vody. Na špinavý lak nesahejte houbou napoprvé — drhne nečistoty do laku.",
        "Používejte dva kbelíky (špína / čistá voda) nebo kvalitní předmytí. Utěrky z mikrovlákna jen na čistý povrch.",
      ],
    },
    {
      heading: "2. Sůl a zima",
      paragraphs: [
        "Po zimě sůl zbytečně nechte na karoserii i podbězích. Čím dřív auto odsolíte a umyjete, tím méně koroze a map.",
        "Interiér po solných botách vysajte a otřete — jinak sůl sedá do koberců a páchne.",
      ],
    },
    {
      heading: "3. Leštění a keramika",
      paragraphs: [
        "Leštění řeší zašlý a jemně poškrábaný lak. Keramika pak drží lesk a usnadní mytí — ale patří na připravený lak, ne na oxidaci.",
        "Mezi profesionálními zákroky stačí šetrné mytí a kvalitní sealant / spray podle doporučení studia.",
      ],
    },
    {
      heading: "4. Interiér a ozon",
      paragraphs: [
        "Pravidelné vysávání a čištění výdechů zabrání usazeninám. Při pachu (kouř, zvířata, vlhkost) pomůže ozon po důkladném vyčištění.",
        "Nenechávejte mokré rohože v autě přes noc — plíseň a pach se vrátí rychle.",
      ],
    },
    {
      heading: "5. Kdy do studia",
      paragraphs: [
        "Když lak ztratí hloubku, světlomety zmatní, nebo interiér po dětech / zvířatech „nejde“ — je čas na detailing, ne na další DIY pastu.",
        "Studio Dr Detailing: Praha 9 — Horní Počernice. Termín přes formulář na webu nebo telefon.",
      ],
    },
  ],
};
