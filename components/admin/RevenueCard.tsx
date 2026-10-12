"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RevenueByMonth } from "@/data/admin-types";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function getRevenueForMonth(
  revenueByMonth: RevenueByMonth[],
  year: number,
  month: number
): number {
  return (
    revenueByMonth.find((r) => r.year === year && r.month === month)?.revenue ?? 0
  );
}

function EmvChip() {
  return (
    <svg viewBox="0 0 48 36" className="h-8 w-[42px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" aria-hidden="true">
      <defs>
        <linearGradient id="rc-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A1" />
          <stop offset="45%" stopColor="#C9A24A" />
          <stop offset="100%" stopColor="#8A6A23" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="47" height="35" rx="6" fill="url(#rc-chip)" stroke="#6B5118" strokeOpacity="0.5" />
      <g fill="none" stroke="#6B5118" strokeOpacity="0.55" strokeWidth="1">
        <path d="M0 12h14M0 24h14M34 12h14M34 24h14" />
        <path d="M14 0v36M34 0v36" />
        <rect x="18" y="9" width="12" height="18" rx="3" />
      </g>
    </svg>
  );
}

function ContactlessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 9.5a4 4 0 0 1 0 5" />
      <path d="M12 7.5a7 7 0 0 1 0 9" />
      <path d="M15.5 5.5a10 10 0 0 1 0 13" />
    </svg>
  );
}

interface RevenueCardProps {
  totalRevenue: number;
  revenueByMonth: RevenueByMonth[];
  variant?: "manage" | "nulis";
}

export function RevenueCard({
  totalRevenue,
  revenueByMonth,
  variant = "manage",
}: RevenueCardProps) {
  const now = new Date();
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
  const [allTime, setAllTime] = useState(false);

  const isCurrentMonth =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth() + 1;

  const value = allTime
    ? totalRevenue
    : getRevenueForMonth(revenueByMonth, cursor.year, cursor.month);
  const label = allTime
    ? "Sejak awal"
    : `${MONTH_NAMES[cursor.month - 1]} ${cursor.year}`;

  const prevMonth = () => {
    setAllTime(false);
    setCursor((c) =>
      c.month === 1
        ? { year: c.year - 1, month: 12 }
        : { year: c.year, month: c.month - 1 }
    );
  };

  const nextMonth = () => {
    setAllTime(false);
    setCursor((c) =>
      c.month === 12
        ? { year: c.year + 1, month: 1 }
        : { year: c.year, month: c.month + 1 }
    );
  };

  const isNulis = variant === "nulis";
  const rp = value.toLocaleString("id-ID");
  const validThru = allTime
    ? "∞/∞"
    : `${String(cursor.month).padStart(2, "0")}/${String(cursor.year).slice(-2)}`;

  const chevronClass =
    "size-7 rounded-full flex items-center justify-center bg-white/10 text-white/80 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div
      className={`group relative isolate overflow-hidden text-white flex flex-col select-none ${
        isNulis ? "rounded-[24px] p-6 h-full min-h-[220px]" : "rounded-[20px] p-5 aspect-[1.586/1] w-full"
      }`}
      style={{
        background:
          "linear-gradient(135deg, #0B0B10 0%, #17161D 42%, #2A1C14 78%, #3B2416 100%)",
        boxShadow:
          "0 18px 40px -18px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full -z-10"
        style={{ background: "radial-gradient(circle, rgba(242,178,124,0.38) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -bottom-28 size-72 rounded-full -z-10"
        style={{ background: "radial-gradient(circle, rgba(120,110,255,0.18) 0%, transparent 65%)" }}
      />
      {/* Engraved stripes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 9px)",
          maskImage: "linear-gradient(90deg, transparent 0%, #000 55%, #000 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 55%, #000 100%)",
        }}
      />
      {/* Holographic sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay transition-transform duration-700 ease-out -translate-x-1/3 group-hover:translate-x-1/3"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 45%, rgba(255,200,150,0.25) 52%, transparent 65%)",
        }}
      />

      {/* Top row: brand + mode */}
      <div className="flex items-start justify-between gap-3">
        <div className="leading-none">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-white/90">
            Charlottenim
          </p>
          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#F2B27C]/80">
            {allTime ? "Revenue · Black" : "Revenue · Monthly"}
          </p>
        </div>
        <div className="flex items-center rounded-full bg-white/10 p-0.5 ring-1 ring-white/15 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setAllTime(false)}
            className={`h-6 px-2.5 rounded-full transition-colors ${!allTime ? "bg-white text-[#0B0B10]" : "text-white/60 hover:text-white"}`}
          >
            Bulanan
          </button>
          <button
            type="button"
            onClick={() => setAllTime(true)}
            className={`h-6 px-2.5 rounded-full transition-colors ${allTime ? "bg-white text-[#0B0B10]" : "text-white/60 hover:text-white"}`}
          >
            All time
          </button>
        </div>
      </div>

      {/* Chip + contactless */}
      <div className={`flex items-center gap-2 ${isNulis ? "mt-5" : "mt-4"}`}>
        <EmvChip />
        <ContactlessIcon />
      </div>

      {/* Amount — embossed like a card number */}
      <p
        className={`font-mono font-semibold tabular-nums leading-none tracking-[0.05em] text-[#E6DDD3] ${isNulis ? "mt-5" : "mt-auto pt-3"}`}
        style={{
          textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.35)",
        }}
      >
        <span className={`${isNulis ? "text-lg" : "text-sm"} align-top mr-1.5 text-[#F2B27C]/80`}>Rp</span>
        <span className={isNulis ? "text-[40px]" : "text-[28px]"}>{rp}</span>
      </p>

      {/* Bottom row: period switcher + brand mark */}
      <div className={`flex items-end justify-between gap-3 ${isNulis ? "mt-auto pt-5" : "mt-3"}`}>
        <div className="flex items-end gap-4">
          <div className="leading-none">
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Periode
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                disabled={allTime}
                aria-label="Bulan sebelumnya"
                className={chevronClass}
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="min-w-[108px] text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-white/90">
                {label}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                disabled={allTime || isCurrentMonth}
                aria-label="Bulan berikutnya"
                className={chevronClass}
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Valid thru
            </p>
            <p className="mt-1.5 h-7 flex items-center font-mono text-[13px] font-semibold tracking-widest text-white/85">
              {validThru}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center" aria-hidden="true">
          <span className="size-7 rounded-full bg-[#EB5A2A]/90" />
          <span className="-ml-3 size-7 rounded-full bg-[#F2B27C]/85 mix-blend-screen" />
        </div>
      </div>
    </div>
  );
}
