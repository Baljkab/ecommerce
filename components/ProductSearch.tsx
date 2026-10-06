"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    router.push(
      value
        ? `/products?q=${encodeURIComponent(value)}`
        : "/products",
    );
  }

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className="flex w-full items-center rounded-full bg-slate-100
        focus-within:ring-2 focus-within:ring-orange-400"
    >
      <label htmlFor="product-search" className="sr-only">
        Бүтээгдэхүүн хайх
      </label>

      <input
        id="product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Бүтээгдэхүүн хайх..."
        maxLength={100}
        className="min-w-0 flex-1 rounded-full bg-transparent
          px-5 py-3 text-sm text-slate-900 outline-none
          placeholder:text-slate-400"
      />

      <button
        type="submit"
        aria-label="Хайх"
        className="mr-1 flex size-10 shrink-0 items-center justify-center
          rounded-full text-slate-500 hover:bg-white hover:text-orange-600
          focus-visible:outline-2 focus-visible:outline-orange-500"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          className="size-5"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      </button>
    </form>
  );
}