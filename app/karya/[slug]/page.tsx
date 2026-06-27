import { notFound } from "next/navigation";
import { getWorkBySlug, getChaptersByWorkSlug } from "@/lib/queries";
import DetailPage from "./DetailPage";

export default async function KaryaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const chapters = await getChaptersByWorkSlug(slug);

  return <DetailPage work={work} chapters={chapters} />;
}
