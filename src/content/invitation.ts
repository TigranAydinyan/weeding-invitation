import coupleChurch from "@/assets/images/mher-ani/couple-church.jpg";
import coupleHug from "@/assets/images/mher-ani/couple-hug.jpg";
import coupleSunset from "@/assets/images/mher-ani/couple-sunset.jpg";
import loriIllustration from "@/assets/images/mher-ani/lori-illustration.jpg";
import venueChurch from "@/assets/images/mher-ani/venue-church.jpg";
import venueHall from "@/assets/images/mher-ani/venue-hall.jpg";

import type { Photo, ProgramItem, Venue, WeddingDate } from "./types";

/**
 * Mher & Ani's wedding invitation — everything shown on the page lives here:
 * names, date, schedule, photos and copy. Components only handle layout.
 */

// TODO: date, times and venues below are placeholders — replace them with
// Mher & Ani's real details (the venue photos show a different church and hall).
const church: Venue = {
  name: "Սուրբ Ամենափրկիչ եկեղեցի",
  address: "ք. Գյումրի, Խ։ Աբովյան փ., 145",
  // St. All Saviors (Surb Amenaprkich) — exact pin from Google Maps.
  mapsQuery: "40.784088,43.8412203",
};

const hall: Venue = {
  name: "«Վահագնի» ռեստորանային համալիր",
  address: "Կոտայքի մարզ, Պտղնի, 1-ին թաղամաս, 35 շ.",
  // Vahakni Pool and Garden — exact pin from Google Maps.
  mapsQuery: "40.2193259,44.4570907",
};

const date: WeddingDate = {
  iso: "2026-12-08",
  startsAt: "2026-12-08T13:30:00+04:00",
  day: "08",
  month: "12",
  year: "2026",
};

export type WeddingProgramItem = ProgramItem & { photo?: Photo };

const program: WeddingProgramItem[] = [
  {
    time: "13:30",
    title: "Եկեղեցի",
    venue: church,
    kind: "church",
    photo: { src: venueChurch, alt: "Եկեղեցին մայրամուտին" },
  },
  {
    time: "18:00",
    title: "Հարսանեկան միջոցառում",
    venue: hall,
    kind: "celebration",
    photo: {
      src: venueHall,
      alt: "Հանդիսությունների սրահի զարդարված սեղանները",
    },
  },
];

export const wedding = {
  couple: {
    groom: "Մհեր",
    bride: "Անի",
  },
  date,
  program,
  photos: {
    /** Watercolor card behind the names — its empty sky is where the text sits. */
    illustration: { src: loriIllustration, alt: "" },
    gallery: [
      { src: coupleChurch, alt: "Զույգը եկեղեցու առջև" },
      { src: coupleHug, alt: "Մհերն ու Անին գրկախառնված, ժպտալով" },
    ],
    finale: { src: coupleSunset, alt: "Մհերն ու Անին մայրամուտին" },
  } satisfies Record<string, Photo | Photo[]>,
};

export const copy = {
  gate: {
    openLabel: "Բացել հրավիրատոմսը",
    prompt: "Սեղմեք բացիկի վրա",
    hint: "հրավիրատոմսը բացելու համար",
  },
  hero: {
    eyebrow: "Save the date",
    lead: "Սրտանց հրավիրում ենք ձեզ մեր հարսանիքին",
    sublead: "միասին տոնելու մեր կյանքի ամենահիշարժան և կարևոր օրը",
  },
  schedule: {
    title: "Սիրով կսպասենք Ձեզ",
    mapLabel: "Տեսնել քարտեզի վրա",
  },
  countdown: {
    title: "Մեր հարսանիքին մնաց…",
    units: { days: "Օր", hours: "Ժամ", minutes: "Րոպե", seconds: "Վրկ" },
    /** Shown once the countdown reaches zero. */
    done: "Այսօր մեր մեծ օրն է",
  },
  finale: {
    quote: ["Ժողովուրդ ջա՜ն, քեֆ ենք անում..."],
    signoff:
      "Ակնկալում ենք ձեր վերջնական պատասխանը, այդ թվում` հյուրերի թիվը, (ներառյալ երեխաները) մինչև դեկտեմբերի 1-ը:",
  },
  music: {
    /**
     * Background song (file in /public) that starts when the envelope is opened;
     * a play/pause button then appears bottom-right. Set to null to disable music.
     * Current track: originally "aramo-mark-svadba-shahen-sargsyan_IPYKJYOa.mp3".
     */
    src: "/audio/wedding-song.mp3" as string | null,
    playLabel: "Միացնել երաժշտությունը",
    pauseLabel: "Դադարեցնել երաժշտությունը",
  },
  lastWords: {
    text: "Սիրով սպասում ենք...",
  },
};
