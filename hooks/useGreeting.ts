"use client"

import { useEffect, useState } from "react"
import { DEFAULT_TIME_ZONE, getGreeting } from "@/lib/greeting"

/**
 * Greeting based on the viewer's own clock. The first render uses a fixed zone so
 * server and client agree; after mount it switches to the device's local time and
 * refreshes every minute so a long-open tab doesn't go stale.
 */
export function useGreeting() {
  const [greeting, setGreeting] = useState(() => getGreeting(new Date(), DEFAULT_TIME_ZONE))

  useEffect(() => {
    const update = () => setGreeting(getGreeting())
    update()
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [])

  return greeting
}
