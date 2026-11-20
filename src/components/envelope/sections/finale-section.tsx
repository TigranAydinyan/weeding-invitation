import { copy, wedding } from "@/content/invitation";

import { GoldHeart } from "../icons";
import { CARD_SIZES, PhotoCard, Reveal } from "../primitives";

export function FinaleSection() {
  const { groom, bride } = wedding.couple;
  const { iso, day, month, year } = wedding.date;
  const { quote, signoff } = copy.finale;
  const { text } = copy.lastWords;

  return (
    <footer className="px-6 pt-16 pb-28">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <PhotoCard photo={wedding.photos.finale} sizes={CARD_SIZES} />
        </Reveal>

        <Reveal delay={200}>
          <blockquote className="mt-12 font-display text-xl leading-relaxed text-ink italic sm:text-2xl">
            {quote.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index < quote.length - 1 && " "}
              </span>
            ))}
          </blockquote>
        </Reveal>

        <Reveal delay={350}>
          <div className="mt-12 flex flex-col items-center gap-3">
            <GoldHeart className="size-4" />
            <p className="text-lg text-ink-soft italic">{signoff}</p>
            <p className="font-display text-3xl text-ink sm:text-4xl">{text}</p>
            <time
              dateTime={iso}
              className="mt-2 text-xs tracking-[0.35em] text-ink-soft"
            >
              {day} · {month} · {year}
            </time>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
