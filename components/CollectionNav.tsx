"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCategories, type Category } from "@/lib/products";

export default function CategoriesNav() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getCategories();
        if (active) setCategories(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Ангиллын цэс хаах" : "Ангиллын цэс нээх"}
        aria-expanded={open}
        aria-controls="category-navigation"
        onClick={() => setOpen((value) => !value)}
        className={`flex size-11 items-center justify-center rounded-xl
          text-slate-800 transition-colors hover:bg-slate-100
          focus-visible:outline-2 focus-visible:outline-orange-500
          ${open ? "bg-[#f7f7fc]" : ""}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-5"
        >
          {open ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="category-navigation"
          aria-label="Барааны ангилал"
          className="absolute left-0 top-full z-50 mt-3
            max-h-[calc(100dvh-110px)] w-[calc(100vw-2rem)]
            overflow-y-auto rounded-2xl bg-[#f7f7fc] p-3
            shadow-xl ring-1 ring-slate-900/5 sm:w-[440px] sm:p-5"
        >
          {loading && (
            <p role="status" className="p-4 text-sm text-slate-500">
              Ангилал ачаалж байна...
            </p>
          )}

          {error && (
            <p role="alert" className="p-4 text-sm text-red-600">
              Ангилал татаж чадсангүй. Хуудсаа шинэчилнэ үү.
            </p>
          )}

          {!loading && !error && categories.length === 0 && (
            <p className="p-4 text-sm text-slate-500">
              Ангилал одоогоор алга байна.
            </p>
          )}

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${encodeURIComponent(category.slug)}`}
              onClick={() => setOpen(false)}
              className="flex min-h-16 items-center gap-4 rounded-xl
                px-4 py-4 text-base font-medium text-slate-900
                transition-colors hover:bg-white hover:text-orange-600
                focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center
                  rounded-xl bg-orange-100 text-orange-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-6"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>

              <span className="min-w-0 break-words">
                {category.name}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}