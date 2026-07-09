"use client";

import Logo from "@/components/Logo";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen px-4 pb-28">
      <div className="max-w-[480px] mx-auto pt-8">
        <Link
          href="/user"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 tap-feedback"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <Logo href={undefined} className="mb-4" />
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted)" }}>
            Platform baca novel & AU karya Charlottenimmm. Temukan cerita premium, dukung langsung kreator favoritmu.
          </p>
        </div>

        <section
          className="rounded-xl p-5 space-y-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="text-sm font-bold font-[family-name:var(--font-display)]">
            Hubungi Kami
          </h2>

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
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
