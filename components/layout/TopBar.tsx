"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  title?: string;
  /** Where the back button goes. Falls back to browser history. */
  backHref?: string;
  right?: React.ReactNode;
  /** Transparent until the page is scrolled, for pages with a hero backdrop. */
  overlay?: boolean;
}

export default function TopBar({ title, backHref, right, overlay }: Props) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(!overlay);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  return (
    <header
      className={`font-ui sticky top-0 z-40 transition-colors duration-300 ${scrolled ? "backdrop-blur-xl" : ""}`}
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--background) 88%, transparent)" : "transparent",
        borderBottom: `1px solid ${scrolled && overlay ? "var(--border)" : "transparent"}`,
      }}
    >
      <div className="max-w-[480px] mx-auto px-2 h-14 flex items-center gap-1">
        <button
          type="button"
          aria-label="Kembali"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="size-10 rounded-full flex items-center justify-center tap-feedback hover:bg-[var(--surface)] transition-colors"
          style={{ color: "var(--foreground)" }}
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1
          className="flex-1 min-w-0 truncate text-[15px] font-semibold transition-opacity duration-300"
          style={{ color: "var(--foreground)", opacity: title && scrolled ? 1 : 0 }}
        >
          {title}
        </h1>
        {right}
      </div>
    </header>
  );
}
