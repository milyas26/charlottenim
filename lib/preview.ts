export function buildPreviewContent(html: string): string {
  const match = html.match(/<p>[\s\S]*?<\/p>/g)
  if (!match || match.length === 0) return html
  const preview = match.slice(0, 3).join("")
  return limitImages(preview, 1)
}

function limitImages(html: string, maxImages: number): string {
  let count = 0
  return html.replace(/<img[\s\S]*?>/gi, (m) => {
    count++
    if (count > maxImages) return ""
    return m
  })
}
