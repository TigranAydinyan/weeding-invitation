import type { StaticImageData } from "next/image";

/** Content types shared by every invitation design. */

export type Photo = {
  src: StaticImageData;
  /** Empty string for purely decorative images. */
  alt: string;
};

export type Venue = {
  name: string;
  address: string;
  /**
   * Query passed to Google Maps when the guest taps the venue link — a place
   * name/address, or "lat,lng" coordinates for an exact pin.
   */
  mapsQuery: string;
};

/** What happens at a program step — each design picks its own icon for it. */
export type EventKind = "church" | "ceremony" | "celebration";

export type ProgramItem = {
  time: string;
  title: string;
  venue: Venue;
  kind: EventKind;
};

export type WeddingDate = {
  /** ISO date used for <time dateTime> attributes. */
  iso: string;
  day: string;
  month: string;
  year: string;
  /** First event of the day with its UTC offset — the countdown target. */
  startsAt: string;
};
