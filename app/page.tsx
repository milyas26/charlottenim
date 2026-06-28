import { apiFetch } from "@/lib/axios"
import type { Work } from "@/data/types"
import LandingPage from "./LandingPage"

export default async function HomePage() {
  const works = await apiFetch<(Work & { totalReads: number })[]>("/api/works")
  return <LandingPage works={works} />
}
