"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import type { RevenueByMonth } from "@/data/admin-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Revenue
          </CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRp(value)}</div>
          <div className="mt-2">{monthSwitcher}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <DollarSign className="size-3.5" style={{ color: "var(--accent)" }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Revenue
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: allTime
              ? "var(--accent)"
              : "color-mix(in srgb, var(--accent) 12%, transparent)",
            color: allTime
              ? "var(--primary-foreground)"
              : "var(--accent)",
          }}
        >
          {allTime ? "All Time" : "Bulan Ini"}
        </span>
      </div>
      <div
        className="text-lg font-bold font-[family-name:var(--font-display)] leading-tight"
        style={{ color: "var(--foreground)" }}
      >
        {formatRp(value)}
      </div>
      <div className="mt-1">{monthSwitcher}</div>
    </div>
  );
}
