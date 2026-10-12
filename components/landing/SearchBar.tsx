"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-colors"
        style={{ color: value ? "var(--accent)" : "var(--muted)" }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari judul cerita…"
        className="w-full h-11 pl-10 pr-10 rounded-xl text-sm outline-none transition-shadow placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--ring)] [&::-webkit-search-cancel-button]:hidden"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      />
      {value && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors tap-feedback"
          style={{ color: "var(--muted)" }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
