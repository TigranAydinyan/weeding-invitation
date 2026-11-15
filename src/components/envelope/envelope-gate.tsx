"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { GoldHeart } from "./icons";

type Phase = "closed" | "opening" | "open" | "done";

type EnvelopeGateProps = {
  children: ReactNode;
  copy: { openLabel: string; prompt: string; hint: string };
  music: { src: string | null; playLabel: string; pauseLabel: string };
};

const FLAP_MS = 750;
const FADE_MS = 450;
const MUSIC_VOLUME = 0.9;
const MUSIC_FADE_MS = 2200;

const noopSubscribe = () => () => {};

/** HTMLMediaElement throws for volumes outside [0, 1] (iOS ignores the setter entirely). */
function setVolume(audio: HTMLAudioElement, value: number) {
  audio.volume = Math.min(1, Math.max(0, value));
}

/**
 * Full-screen envelope the guest taps to "open" the invitation.
 * Opening also starts the (optional) background music — browsers only allow
 * audio after a user gesture — and switches on scroll-reveal animations.
 */
export function EnvelopeGate({ children, copy, music }: EnvelopeGateProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const isOpen = phase === "open" || phase === "done";

  // Advance the opening sequence: flap folds back → overlay fades → unmount.
  useEffect(() => {
    if (phase === "opening") {
      const timer = setTimeout(() => setPhase("open"), FLAP_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "open") {
      const timer = setTimeout(() => setPhase("done"), FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Keep the page behind the envelope from scrolling.
  useEffect(() => {
    if (isOpen) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [isOpen]);

  // Reveal blocks as they scroll into view (starts once the envelope opens).
  useEffect(() => {
    const root = contentRef.current;
    if (!isOpen || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isOpen]);

  // Pause while the page is in the background (tab switched, phone locked) and
  // resume on return — but only if it was playing when the guest left.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let resumeOnReturn = false;
    const onVisibilityChange = () => {
      if (document.hidden) {
        resumeOnReturn = !audio.paused;
        audio.pause();
      } else if (resumeOnReturn) {
        resumeOnReturn = false;
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  function stopFade() {
    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
    fadeFrameRef.current = null;
  }

  /** Starts the song on the envelope tap and fades it in. */
  function startMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    stopFade();
    setVolume(audio, 0);
    audio
      .play()
      .then(() => {
        // Measure from the first frame's own timestamp: rAF timestamps can be
        // slightly *earlier* than performance.now() taken before scheduling,
        // which made the progress (and so the volume) negative.
        let startedAt: number | undefined;
        const fadeIn = (now: number) => {
          startedAt ??= now;
          const progress = Math.min(1, (now - startedAt) / MUSIC_FADE_MS);
          setVolume(audio, progress * MUSIC_VOLUME);
          fadeFrameRef.current = progress < 1 ? requestAnimationFrame(fadeIn) : null;
        };
        fadeFrameRef.current = requestAnimationFrame(fadeIn);
      })
      .catch(() => {
        // Autoplay was refused: restore the volume so the play button is audible.
        setVolume(audio, MUSIC_VOLUME);
      });
  }

  function handleOpen() {
    if (phase !== "closed") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduceMotion ? "open" : "opening");
    startMusic();
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Whatever happened before (an interrupted fade, a refused autoplay),
      // a tap on play should always be audible.
      stopFade();
      setVolume(audio, MUSIC_VOLUME);
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  return (
    <>
      {phase !== "done" && (
        <div
          className={cn(
            "envelope-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-b from-ivory to-sand px-6 transition-[opacity,scale] duration-400 ease-out",
            isOpen && "pointer-events-none scale-96 opacity-0",
          )}
        >
          <button
            type="button"
            onClick={handleOpen}
            aria-label={copy.openLabel}
            className="block cursor-pointer rounded-md perspective-[1200px] focus-visible:outline-gold"
          >
            <Envelope opening={phase !== "closed"} />
          </button>
          <div className="mt-10 max-w-xs text-center">
            <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">{copy.prompt}</p>
            <p className="mt-1 text-sm text-ink-soft sm:text-base">{copy.hint}</p>
          </div>
        </div>
      )}

      <div ref={contentRef} inert={hydrated && !isOpen}>
        {children}
      </div>

      {music.src && (
        <>
          <audio
            ref={audioRef}
            src={music.src}
            loop
            // Download only once the guest opens the envelope (play() is called on that tap).
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {isOpen && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={playing ? music.pauseLabel : music.playLabel}
              className="fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full border border-champagne/70 bg-white/85 text-ink shadow-[0_10px_25px_-10px_rgb(120_90_40/0.4)] backdrop-blur transition-colors hover:bg-white motion-safe:animate-[soft-fade_600ms_ease-out]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {playing ? (
                  <>
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </>
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          )}
        </>
      )}
    </>
  );
}

function Envelope({ opening }: { opening: boolean }) {
  return (
    <div
      className={cn(
        "relative aspect-3/2 w-[min(82vw,340px)] transform-3d",
        !opening && "motion-safe:animate-gentle-float",
      )}
    >
      {/* Body */}
      <div className="absolute inset-0 rounded-[4px] bg-linear-160 from-[#fbf6ec] via-[#f3e8d1] via-55% to-[#e8d6b3] shadow-[0_30px_60px_-30px_rgb(120_90_40/0.35),0_8px_20px_-10px_rgb(120_90_40/0.25),inset_0_0_0_1px_rgb(200_170_110/0.35)]" />
      <svg
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <path d="M0 200 150 110 300 200" fill="none" stroke="rgb(180 145 80 / 0.25)" />
        <path d="M0 0 150 90 300 0" fill="none" stroke="rgb(180 145 80 / 0.15)" />
      </svg>

      {/* Flap — folds back over the top edge when opened */}
      <div
        className={cn(
          "absolute inset-0 z-3 origin-top transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] transform-3d",
          opening && "rotate-x-180",
        )}
      >
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true" className="block size-full">
          <defs>
            <linearGradient id="envelope-flap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf9ef" />
              <stop offset="100%" stopColor="#eeddb8" />
            </linearGradient>
          </defs>
          <path d="M0 0h300L150 118Z" fill="url(#envelope-flap)" stroke="rgb(180 145 80 / 0.35)" strokeWidth={0.8} />
        </svg>
      </div>

      {/* Wax-seal heart */}
      <div
        className={cn(
          "absolute top-[58%] left-1/2 z-4 -translate-1/2 transition-opacity duration-300",
          opening ? "opacity-0" : "motion-safe:animate-heart-pulse",
        )}
      >
        <GoldHeart className="size-6 drop-shadow-[0_2px_3px_rgb(140_100_40/0.4)]" />
      </div>
    </div>
  );
}
