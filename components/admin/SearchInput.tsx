"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  /** Called with the debounced value, not on every keystroke. */
  onChange: (v: string) => void
  placeholder: string
  className?: string
  /** Debounce delay in ms. */
  delay?: number
  /** Shows a small spinner while results for the current query are loading. */
  loading?: boolean
}

/**
 * Search field that owns its text so typing never depends on the parent
 * re-rendering; the parent only hears about the query after `delay` ms.
 */
export function SearchInput({ value, onChange, placeholder, className, delay = 400, loading }: Props) {
  const [text, setText] = useState(value)
  const lastEmitted = useRef(value)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Follow outside resets (e.g. the parent clears the search) without
  // clobbering what the user is currently typing.
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      setText(value)
    }
  }, [value])

  useEffect(() => {
    if (text === lastEmitted.current) return
    const timer = setTimeout(() => {
      lastEmitted.current = text
      onChangeRef.current(text)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, delay])

  const clear = () => {
    setText("")
    lastEmitted.current = ""
    onChangeRef.current("")
  }

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text !== lastEmitted.current) {
            lastEmitted.current = text
            onChangeRef.current(text)
          }
        }}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 rounded-full bg-card border border-border text-sm outline-none transition placeholder:text-muted-foreground focus:border-input focus:ring-[3px] focus:ring-ring [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
        {loading ? (
          <Loader2 className="size-4 mr-1.5 animate-spin text-muted-foreground" />
        ) : (
          text && (
            <button
              type="button"
              onClick={clear}
              aria-label="Hapus pencarian"
              className="size-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  )
}
