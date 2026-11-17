import { getLang } from "../lib/lang"
import type { ImageKey } from "./types"

export interface Photo {
  src: string
  alt: string
  altEn: string
  credit: string
  creditUrl: string
  /** CSS object-position for cropping. */
  position: string
}

const utm = "?utm_source=pamana&utm_medium=referral"

export const photos: Record<ImageKey, Photo> = {
  banaue: {
    src: "https://images.unsplash.com/photo-1711060169357-ed923c9f2156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mga palayan at kabundukan ng Ifugao",
    altEn: "Rice terraces and mountains of Ifugao",
    credit: "Helena Pfisterer",
    creditUrl: `https://unsplash.com/@pixbyhelena${utm}`,
    position: "center 60%",
  },
  intramuros: {
    src: "https://images.unsplash.com/photo-1736122094944-da4deea774ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Batong tarangkahan sa Intramuros, Maynila",
    altEn: "A stone gate in Intramuros, Manila",
    credit: "German Rivera De La Torre",
    creditUrl: `https://unsplash.com/@potato_traveler${utm}`,
    position: "center",
  },
  manilaCathedral: {
    src: "https://images.unsplash.com/photo-1638751260202-2e0e7839a9e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Ang Manila Cathedral at ang berdeng simboryo nito",
    altEn: "Manila Cathedral and its green dome",
    credit: "Kevin Rein Bantang",
    creditUrl: `https://unsplash.com/@kevinrein05${utm}`,
    position: "center 40%",
  },
  festival: {
    src: "https://images.unsplash.com/photo-1579957023433-7fad5b83efae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mga mananayaw na nakasuot ng pula at gintong kasuotan sa pista",
    altEn: "Dancers in red and gold costumes at a festival",
    credit: "Chloe Evans",
    creditUrl: `https://unsplash.com/@chloeevans${utm}`,
    position: "center",
  },
  rizalMonument: {
    src: "https://images.unsplash.com/photo-1560804445-edc0a0fbbc2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Ang bantayog ni Jose Rizal sa Maynila",
    altEn: "The Jose Rizal monument in Manila",
    credit: "Jim Stapleton",
    creditUrl: `https://unsplash.com/@sepatsj${utm}`,
    position: "center 30%",
  },
  angkor: {
    src: "https://images.unsplash.com/photo-1599283787923-51b965a58b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mga taong naglalakad patungo sa templo ng Angkor Wat sa Cambodia",
    altEn: "People walking toward the Angkor Wat temple in Cambodia",
    credit: "allPhoto Bangkok",
    creditUrl: `https://unsplash.com/@allphotobangkok${utm}`,
    position: "center",
  },
  greatWall: {
    src: "https://images.unsplash.com/photo-1608037521277-154cd1b89191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Ang Great Wall of China sa ibabaw ng luntiang kabundukan",
    altEn: "The Great Wall of China over green mountains",
    credit: "William Olivieri",
    creditUrl: `https://unsplash.com/@akaguglielmo${utm}`,
    position: "center",
  },
  pottery: {
    src: "https://images.unsplash.com/photo-1699371830139-cb02e94878f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mga palayok na gawa sa luwad",
    altEn: "Clay pottery",
    credit: "Swastik Arora",
    creditUrl: `https://unsplash.com/@swastikarora${utm}`,
    position: "center 60%",
  },
  monks: {
    src: "https://images.unsplash.com/photo-1770921306275-6bb8d4ecd65f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Dalawang mongheng Budista na naglalakad malapit sa puting templo",
    altEn: "Two Buddhist monks walking near a white temple",
    credit: "BLOG REGION",
    creditUrl: `https://unsplash.com/@blog_region${utm}`,
    position: "center 45%",
  },
  floatingMarket: {
    src: "https://images.unsplash.com/photo-1506801310323-534be5e7a730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mga bangkang nagtitinda sa isang floating market",
    altEn: "Vendor boats at a floating market",
    credit: "Frida Aguilar Estrada",
    creditUrl: `https://unsplash.com/@fridaae29${utm}`,
    position: "center",
  },
  palawan: {
    src: "https://images.unsplash.com/photo-1695051702427-1c24ce3682e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Tanaw mula sa itaas ng dalampasigan at kagubatan",
    altEn: "Aerial view of a beach and forest",
    credit: "Mario von Rotz",
    creditUrl: `https://unsplash.com/@mariovr${utm}`,
    position: "center",
  },
  cityCrowd: {
    src: "https://images.unsplash.com/photo-1547448526-5e9d57fa28f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Maraming taong tumatawid sa Shibuya, Tokyo",
    altEn: "Crowds crossing Shibuya, Tokyo",
    credit: "Timo Volz",
    creditUrl: `https://unsplash.com/@magict1911${utm}`,
    position: "center",
  },
  pyramids: {
    src: "https://images.unsplash.com/photo-1600520611035-84157ad4084d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Isang piramide sa Giza, Egypt",
    altEn: "A pyramid at Giza, Egypt",
    credit: "Osama Elsayed",
    creditUrl: `https://unsplash.com/@osamaabosaadia${utm}`,
    position: "center",
  },
  market: {
    src: "https://images.unsplash.com/photo-1695654402840-2ced27739781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Isang tindera na nag-aabot ng gulay sa mamimili",
    altEn: "A vendor handing vegetables to a shopper",
    credit: "Grab",
    creditUrl: `https://unsplash.com/@grab${utm}`,
    position: "center",
  },
  flood: {
    src: "https://images.unsplash.com/photo-1545276070-ec815f01c6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Isang bayang binaha",
    altEn: "A flooded town",
    credit: "Chris Gallagher",
    creditUrl: `https://unsplash.com/@chriswebdog${utm}`,
    position: "center",
  },
}

/** Returns the photo URL resized to the requested width. */
export function photoUrl(key: ImageKey, width: number): string {
  const url = new URL(photos[key].src)
  url.searchParams.set("w", String(width))
  return url.toString()
}

/** Alt text in the current site language. */
export function photoAlt(key: ImageKey): string {
  return getLang() === "en" ? photos[key].altEn : photos[key].alt
}
