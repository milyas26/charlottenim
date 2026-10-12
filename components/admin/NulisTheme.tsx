"use client"

import { useEffect } from "react"

/** Puts the admin theme on <html> so portalled UI (dialogs, menus) uses it too. */
export function NulisTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add("nulis-theme")
    return () => root.classList.remove("nulis-theme")
  }, [])
  return null
}
