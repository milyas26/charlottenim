const coverGradients: Record<string, string> = {
  "senja-di-ujung-maret": "linear-gradient(160deg, #e8c9a0 0%, #c08b5e 45%, #6b3a2a 100%)",
  "dua-detik-sebelum-kamu": "linear-gradient(160deg, #a3b5c8 0%, #5a6d82 50%, #2d3748 100%)",
  "hujan-terakhir-di-bulan-juni": "linear-gradient(160deg, #bdd6e4 0%, #5e8ea6 50%, #1c4358 100%)",
  "surat-kecil-untuk-bintang": "linear-gradient(160deg, #d5cdec 0%, #8568c4 50%, #36236e 100%)",
  "antara-jakarta-dan-kenangan": "linear-gradient(160deg, #e6d3b8 0%, #ad8c5e 50%, #5f4022 100%)",
  "pagi-yang-tertukar": "linear-gradient(160deg, #f2d0c6 0%, #c07058 50%, #601810 100%)",
  "stasiun-terakhir": "linear-gradient(160deg, #b0bfb2 0%, #557058 50%, #142618 100%)",
  "kedai-hujan": "linear-gradient(160deg, #c8d8c4 0%, #6e9460 50%, #204a1c 100%)",
};

const fallbackGradient = "linear-gradient(160deg, #d9cec0 0%, #b09e8d 55%, #6b5d50 100%)";

export function hasCoverImage(src?: string | null): src is string {
  return !!src && (src.startsWith("http") || src.startsWith("data:"));
}

interface Props {
  src?: string | null;
  title: string;
  slug?: string;
  className?: string;
  /** Show the title on gradient fallback covers. */
  showTitle?: boolean;
}

export default function BookCover({ src, title, slug, className = "", showTitle = true }: Props) {
  const hasImage = hasCoverImage(src);

  return (
    <div
      className={`book-cover relative aspect-[2/3] overflow-hidden rounded-lg ${className}`}
      style={{ background: hasImage ? "var(--surface)" : (slug && coverGradients[slug]) || fallbackGradient }}
    >
      {hasImage ? (
        <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        showTitle && (
          <div className="absolute inset-0 flex items-end p-3">
            <span className="font-title text-[13px] font-semibold leading-snug text-white/95 drop-shadow-md line-clamp-4">
              {title}
            </span>
          </div>
        )
      )}
    </div>
  );
}
