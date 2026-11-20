"use client";

import { Fragment, useSyncExternalStore } from "react";

import { GoldHeart } from "./icons";

type CountdownProps = {
  /** ISO timestamp with offset, e.g. 2026-12-08T13:30:00+04:00 */
  target: string;
  units: { days: string; hours: string; minutes: string; seconds: string };
  doneLabel: string;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, SECOND);
  return () => clearInterval(id);
}

/** Current time, quantised to the second so React re-renders once per tick. */
const getNow = () => Math.floor(Date.now() / SECOND) * SECOND;
/** The server has no "now": render a neutral placeholder and fill it in on the client. */
const getServerNow = () => null;

export function Countdown({ target, units, doneLabel }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const remaining = now === null ? null : Date.parse(target) - now;

  if (remaining !== null && remaining <= 0) {
    return (
      <p className="font-display text-2xl text-ink italic sm:text-3xl">
        {doneLabel}{" "}
        <GoldHeart className="inline-block size-[0.8em] align-[-0.05em]" />
      </p>
    );
  }

  const parts =
    remaining === null
      ? null
      : {
          days: Math.floor(remaining / DAY),
          hours: Math.floor((remaining % DAY) / HOUR),
          minutes: Math.floor((remaining % HOUR) / MINUTE),
          seconds: Math.floor((remaining % MINUTE) / SECOND),
        };

  const cells = [
    { key: "days", label: units.days, value: parts?.days },
    { key: "hours", label: units.hours, value: parts?.hours },
    { key: "minutes", label: units.minutes, value: parts?.minutes },
    { key: "seconds", label: units.seconds, value: parts?.seconds },
  ] as const;

  return (
    <div
      role="timer"
      className="flex items-start justify-center gap-3 sm:gap-6"
    >
      {cells.map((cell, index) => (
        <Fragment key={cell.key}>
          {index > 0 && (
            <span
              aria-hidden="true"
              className="mt-1 font-display text-3xl text-gold-deep/60 sm:text-5xl"
            >
              ·
            </span>
          )}
          <div className="flex min-w-16 flex-col items-center sm:min-w-21">
            <span className="font-display text-4xl leading-none text-ink tabular-nums lining-nums sm:text-6xl">
              {cell.value === undefined
                ? "--"
                : String(cell.value).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] tracking-[0.3em] text-ink-soft uppercase sm:text-xs">
              {cell.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
