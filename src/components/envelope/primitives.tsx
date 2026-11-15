import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { Photo } from "@/content/types";
import { cn } from "@/lib/cn";

import { GoldHeart } from "./icons";

/** Fades its content up when scrolled into view (driven by EnvelopeGate). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal="" className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Warm, soft drop shadow shared by every card in this design. */
export const CARD_SHADOW = "shadow-[0_22px_45px_-25px_rgb(120_90_40/0.35),0_6px_14px_-6px_rgb(120_90_40/0.15)]";

/**
 * A photo mounted on a white card. By default the photo keeps its own shape;
 * pass `imageClassName` (e.g. "aspect-4/5 object-cover") to frame it instead.
 */
export function PhotoCard({
  photo,
  sizes,
  className,
  imageClassName,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("rounded-md bg-white p-3 sm:p-4", CARD_SHADOW, className)}>
      <Image
        src={photo.src}
        alt={photo.alt}
        sizes={sizes}
        placeholder="blur"
        className={cn("block h-auto w-full rounded-sm", imageClassName)}
      />
    </div>
  );
}

/** Thin gold rules either side of a small heart, used between sections. */
export function Ornament() {
  return (
    <div aria-hidden="true" className="my-10 flex items-center justify-center gap-4 opacity-70">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold/60" />
      <GoldHeart className="size-3.5" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold/60" />
    </div>
  );
}

export function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-3xl text-ink sm:text-4xl">
      {children}
    </h2>
  );
}

/** `sizes` for a card inside the max-w-xl (36rem) column with px-6 padding. */
export const CARD_SIZES = "(min-width: 36rem) 34rem, calc(100vw - 3rem)";
