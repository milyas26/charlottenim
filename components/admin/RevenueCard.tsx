"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
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

function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
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
    ? "Total pendapatan"
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

  const chevronBase =
    "p-1 rounded-md transition-colors hover:bg-[var(--surface)] disabled:opacity-40 disabled:pointer-events-none";
  const chevronClass = allTime ? "disabled:opacity-40" : "";

  const monthSwitcher = (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={prevMonth}
          disabled={allTime}
          className={`${chevronBase} ${chevronClass}`}
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="size-3.5" style={{ color: "var(--accent)" }} />
        </button>
        <span
          className="text-[10px] font-medium whitespace-nowrap"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={allTime || isCurrentMonth}
          className={`${chevronBase} ${chevronClass}`}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="size-3.5" style={{ color: "var(--accent)" }} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setAllTime((v) => !v)}
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors shrink-0"
        style={
          allTime
            ? { backgroundColor: "var(--accent)", color: "var(--primary-foreground)" }
            : {
                backgroundColor: "var(--surface)",
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }
        }
      >
        {allTime ? "Bulan" : "All Time"}
      </button>
    </div>
  );

  if (variant === "nulis") {
    const rp = value.toLocaleString("id-ID");
    return (
      <div
        className="relative overflow-hidden rounded-[24px] p-6 text-[#171717] h-full flex flex-col"
        style={{ background: "linear-gradient(125deg, #F2B27C 0%, #F6D9BD 52%, #E3E4EA 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)" }}
        />
        <div className="relative flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-[#171717]/70">
            {allTime ? "Total pendapatan" : "Pendapatan bulan ini"}
          </span>
          <div className="flex items-center rounded-full bg-white/55 p-0.5 backdrop-blur-sm text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setAllTime(false)}
              className={`h-7 px-3 rounded-full transition-colors ${!allTime ? "bg-white shadow-sm" : "text-[#171717]/60"}`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setAllTime(true)}
              className={`h-7 px-3 rounded-full transition-colors ${allTime ? "bg-white shadow-sm" : "text-[#171717]/60"}`}
            >
              All time
            </button>
          </div>
        </div>

        <p className="relative mt-6 font-semibold tracking-[-0.03em] tabular-nums leading-none">
          <span className="text-xl align-top mr-1 text-[#171717]/70">Rp</span>
          <span className="text-[44px]">{rp}</span>
        </p>

        <div className="relative mt-auto pt-6 flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            disabled={allTime}
            aria-label="Bulan sebelumnya"
            className="size-8 rounded-full bg-white/55 backdrop-blur-sm flex items-center justify-center transition hover:bg-white/80 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[132px] text-center text-[13px] font-semibold">
            {allTime ? "Sejak awal" : label}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            disabled={allTime || isCurrentMonth}
            aria-label="Bulan berikutnya"
            className="size-8 rounded-full bg-white/55 backdrop-blur-sm flex items-center justify-center transition hover:bg-white/80 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, var(--card)) 0%, var(--card) 70%)",
        border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--border))",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="size-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent) 16%, transparent)",
              color: "var(--accent)",
            }}
          >
            <DollarSign className="size-3.5" />
          </span>
          <span className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
            Pendapatan
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: allTime
              ? "var(--accent)"
              : "color-mix(in srgb, var(--accent) 12%, transparent)",
            color: allTime
              ? "var(--primary-foreground)"
              : "var(--accent)",
          }}
        >
          {allTime ? "All Time" : "Bulanan"}
        </span>
      </div>
      <div
        className="text-[1.75rem] font-bold leading-tight mt-3 tabular-nums"
        style={{ color: "var(--foreground)" }}
      >
        {formatRp(value)}
      </div>
      <div className="mt-2">{monthSwitcher}</div>
    </div>
  );
}
