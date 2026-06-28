"use client";

import { ReaderSettings } from "@/data/types";

const fontSizeMap: Record<ReaderSettings["fontSize"], string> = {
  small: "15px",
  medium: "17px",
  large: "19px",
};

const lineHeightMap: Record<ReaderSettings["lineSpacing"], string> = {
  tight: "1.75",
  normal: "2.1",
  relaxed: "2.5",
};

const fontFamilyMap: Record<ReaderSettings["fontFamily"], string> = {
  lora: "var(--font-lora)",
  georgia: "Georgia, 'Times New Roman', serif",
  sans: "var(--font-geist-sans)",
};

interface Props {
  content: string;
  settings: ReaderSettings;
  isPremium: boolean;
  isUnlocked: boolean;
  previewOnly?: boolean;
}

export default function ChapterContent({
  content,
  settings,
  isPremium,
  isUnlocked,
  previewOnly = false,
}: Props) {
  const previewParagraphs = getPreviewParagraphs(content);
  const displayContent =
    isPremium && !isUnlocked && previewOnly ? previewParagraphs : content;
  const showDropCap = !(isPremium && !isUnlocked && previewOnly);

  return (
    <article
      style={{
        color: "var(--rm-fg, var(--foreground))",
        fontSize: `var(--r-fs, ${fontSizeMap[settings.fontSize]})`,
        lineHeight: `var(--r-lh, ${lineHeightMap[settings.lineSpacing]})`,
        fontFamily: `var(--r-ff, ${fontFamilyMap[settings.fontFamily]})`,
      }}
    >
      <div
        className={showDropCap ? "reader-content" : "reader-content-preview"}
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </article>
  );
}

function getPreviewParagraphs(html: string): string {
  const match = html.match(/<p>[\s\S]*?<\/p>/g);
  if (!match || match.length === 0) return html;
  return match.slice(0, 3).join("");
}
