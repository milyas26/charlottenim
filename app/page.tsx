import { getAllWorks } from "@/lib/queries"
import LandingPage from "./LandingPage"

export default async function HomePage() {
  const works = await getAllWorks()
  return <LandingPage works={works} />
}
