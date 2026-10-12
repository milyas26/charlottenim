"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LIMIT_OPTIONS = [10, 25, 50, 100, 200]

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (page <= 3) return [1, 2, 3, 4, "...", totalPages - 1, totalPages]
  if (page >= totalPages - 2) return [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]

  return [1, "...", page - 1, page, page + 1, "...", totalPages]
}

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="w-6 text-center text-muted-foreground text-sm select-none">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-8 text-[13px] tabular-nums",
                  p !== page && "font-medium text-muted-foreground hover:text-foreground"
                )}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <span className="sm:hidden px-1 text-[13px] text-muted-foreground tabular-nums">
          Hal {page} / {totalPages}
        </span>

        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
        <span className="hidden sm:inline whitespace-nowrap tabular-nums">
          {start}–{end} dari {total}
        </span>

        <Select
          value={String(limit)}
          onValueChange={(v) => onLimitChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[78px] rounded-full bg-secondary border-transparent text-[13px] font-medium text-foreground shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {LIMIT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
