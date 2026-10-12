"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import ContactList from "@/components/layout/ContactList";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/baca/")) return null;
  if (pathname.startsWith("/nulis")) return null;

  return (
    <footer className="font-ui mt-auto border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-[480px] mx-auto px-4 pt-8 pb-24 text-center">
        <Logo href={undefined} />
        <p className="text-[13px] leading-relaxed max-w-xs mx-auto mt-2" style={{ color: "var(--muted)" }}>
          Rumah untuk novel & AU karya Charlottenimmm. Baca, simpan, dan dukung langsung penulisnya.
        </p>
        <div className="mt-6 text-left">
          <ContactList />
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 text-[13px] font-medium">
          <Link href="/" style={{ color: "var(--foreground)" }} className="hover:opacity-70">Beranda</Link>
          <Link href="/shop" style={{ color: "var(--foreground)" }} className="hover:opacity-70">Toko</Link>
          <Link href="/contact" style={{ color: "var(--foreground)" }} className="hover:opacity-70">Kontak</Link>
        </div>
        <p className="text-[11px] mt-5" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} Charlottenimmm
        </p>
      </div>
    </footer>
  );
}
