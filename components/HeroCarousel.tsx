"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

const AUTOPLAY_MS = 5000;

const fallbackSlide: HeroSlide = {
  id: -1,
  title: "Технологийн шинэ сонголт",
  subtitle: "Өдөр тутмын хэрэглээ",
  imageUrl: "/images/home/tech-desk.webp",
  href: "/products",
};

function getSlideLabel(value: string, fallback: string) {
  const label = value.trim();
  return !label || label.length < 3 || /^(s\/a|n\/a)$/i.test(label)
    ? fallback
    : label;
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<number[]>([]);
  const reduceMotion = useReducedMotion();
  const activeSlides = slides.length > 0 ? slides : [fallbackSlide];
  const count = activeSlides.length;
  const slide = activeSlides[index] ?? activeSlides[0];
  const imageUnavailable =
    !slide.imageUrl || failedImageIds.includes(slide.id);
  const imageSrc = imageUnavailable
    ? "/images/home/tech-desk.webp"
    : slide.imageUrl;
  const slideTitle = getSlideLabel(slide.title, "Онцлох бүтээгдэхүүн");
  const slideSubtitle = getSlideLabel(slide.subtitle, "Шинэ сонголтууд");

  useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, count]);

  function goTo(nextIndex: number) {
    setIndex(((nextIndex % count) + count) % count);
  }

  function handleImageError() {
    setFailedImageIds((current) =>
      current.includes(slide.id) ? current : [...current, slide.id],
    );
  }

  const initialMotion = reduceMotion ? false : { opacity: 0, y: 18 };
  const slideTransition = {
    duration: reduceMotion ? 0 : 0.45,
    ease: "easeOut" as const,
  };

  return (
    <section
      aria-label="Онцлох бүтээгдэхүүн"
      className="mx-auto max-w-[1600px] px-3 pt-3 sm:px-6 sm:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#101827] text-white shadow-2xl shadow-slate-900/10 sm:rounded-[2.25rem]">
        <Image
          src="/images/home/tech-desk.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="pointer-events-none -z-20 object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#101827] via-[#101827]/95 to-[#101827]/55" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-5rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-orange-500/20 blur-[100px]"
          animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="grid min-h-[610px] items-center gap-8 px-5 py-10 sm:px-10 sm:py-12 lg:min-h-[540px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-14">
          <div className="relative z-10 max-w-xl">
            <motion.p
              initial={initialMotion}
              animate={{ opacity: 1, y: 0 }}
              transition={slideTransition}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-orange-200 uppercase backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_4px_rgba(251,146,60,0.45)]" />
              TechStore · Технологийн дэлгүүр
            </motion.p>

            <motion.h1
              initial={initialMotion}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideTransition, delay: reduceMotion ? 0 : 0.08 }}
              className="mt-7 text-4xl leading-[1.08] font-black tracking-tight sm:text-5xl lg:text-[3.65rem]"
            >
              Технологио
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                шинэ түвшинд.
              </span>
            </motion.h1>

            <motion.p
              initial={initialMotion}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideTransition, delay: reduceMotion ? 0 : 0.16 }}
              className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base"
            >
              Ажил, тоглоом, өдөр тутмын хэрэглээнд тохирох төхөөрөмжөө нэг
              дороос сонгоорой.
            </motion.p>

            <motion.div
              initial={initialMotion}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...slideTransition, delay: reduceMotion ? 0 : 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href={slide.href}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
              >
                Онцлох бараа үзэх
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M3.5 10h13m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Бүх бүтээгдэхүүн
              </Link>
            </motion.div>

            <div className="mt-9 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px w-9 bg-orange-400/80" />
              <span aria-live="polite">
                {slideSubtitle} <span className="text-white/30">/</span>{" "}
                {slideTitle}
              </span>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -inset-3 rounded-[2rem] bg-orange-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-slate-950/45 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm sm:rounded-[1.8rem] sm:p-4">
              <div className="relative aspect-[1.22] overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-slate-800/80 to-slate-950/90 sm:aspect-[1.38]">
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 92vw, 48vw"
                  className="scale-110 object-cover opacity-80 blur-lg saturate-125"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-slate-950/10" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    className="absolute inset-0"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
                    transition={slideTransition}
                  >
                    <Image
                      src={imageSrc}
                      alt={imageUnavailable ? "" : slideTitle}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 92vw, 48vw"
                      className="object-contain p-3 sm:p-6"
                      onError={handleImageError}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/75 to-transparent" />
                <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-4 sm:right-5 sm:bottom-5 sm:left-5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-orange-300 uppercase">
                      Онцлох сонголт
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                      {slideTitle}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(count).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {count > 1 && (
                <div className="flex items-center justify-between px-1 pt-3">
                  <div className="flex items-center gap-1.5">
                    {activeSlides.map((item, slideIndex) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`${slideIndex + 1}-р слайд руу очих`}
                        aria-current={slideIndex === index ? "true" : undefined}
                        onClick={() => goTo(slideIndex)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          slideIndex === index
                            ? "w-8 bg-orange-400"
                            : "w-2 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Өмнөх слайд"
                      onClick={() => goTo(index - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
                    >
                      <span aria-hidden="true">←</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Дараагийн слайд"
                      onClick={() => goTo(index + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
                    >
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
