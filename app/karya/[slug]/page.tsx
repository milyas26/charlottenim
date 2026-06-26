import { notFound } from "next/navigation";
import { getWorkBySlug, getChaptersByWorkSlug } from "@/data/dummy";
import DetailPage from "./DetailPage";

export default async function KaryaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const chapters = getChaptersByWorkSlug(slug);

  return <DetailPage work={work} chapters={chapters} />;
}
