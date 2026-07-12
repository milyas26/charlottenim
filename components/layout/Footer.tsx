"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/baca/")) return null;
  if (pathname.startsWith("/nulis")) return null;

  return (
    <footer className="mt-auto border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-[480px] mx-auto px-4 pt-10 pb-6 space-y-8">
        <div className="flex flex-col items-center text-center">
          <Logo href={undefined} className="mb-3" />
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted)" }}>
            Platform baca novel & AU karya Charlottenimmm. Temukan cerita premium, dukung langsung kreator favoritmu.
          </p>
        </div>

        <div
          className="rounded-xl p-5 space-y-4"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 className="text-xs font-bold font-[family-name:var(--font-display)]">
            Hubungi Kami
          </h3>

          <a
            href="mailto:charlottenimmm@gmail.com"
            className="flex items-center gap-3 text-sm tap-feedback transition-colors hover:opacity-80"
          >
            <div
              className="size-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Mail size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                Email
              </p>
              <p className="text-sm font-medium truncate">
                charlottenimmm@gmail.com
              </p>
            </div>
          </a>

          <a
            href="tel:+6285159335715"
            className="flex items-center gap-3 text-sm tap-feedback transition-colors hover:opacity-80"
          >
            <div
              className="size-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Phone size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                Telepon
              </p>
              <p className="text-sm font-medium">+62 851-5933-5715</p>
            </div>
          </a>

          <div className="flex items-center gap-3 text-sm">
            <div
              className="size-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                Alamat
              </p>
              <p className="text-sm font-medium">
                Karet, Setiabudi, Jakarta Selatan
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          {/* <p
            className="text-[10px] tracking-[0.3em] uppercase font-semibold"
            style={{ color: "var(--muted)", opacity: 0.35 }}
          >
            charlottenimmm
          </p> */}
        </div>
      </div>
    </footer>
  );
}
