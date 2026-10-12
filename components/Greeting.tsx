"use client"

import { useGreeting } from "@/hooks/useGreeting"

interface Props {
  name?: string | null
  suffix?: string
}

/** "Selamat pagi, {name}{suffix}" using the viewer's local time. */
export default function Greeting({ name, suffix = "" }: Props) {
  const greeting = useGreeting()
  return (
    <span suppressHydrationWarning>
      {greeting}
      {name ? `, ${name}!` : ""}
      {suffix}
    </span>
  )
}
