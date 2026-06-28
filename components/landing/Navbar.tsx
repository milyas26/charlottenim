"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const { user: dbUser, loading } = useAuth();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 4;
      el.style.borderBottomColor = scrolled ? "var(--border)" : "transparent";
      el.style.backgroundColor = scrolled
        ? "color-mix(in srgb, var(--background) 85%, transparent)"
        : "transparent";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 backdrop-blur-xl transition-all duration-300"
      style={{ borderBottom: "1px solid transparent" }}
    >
      <div className="max-w-[480px] mx-auto px-5 h-14 flex items-center justify-between">
        <Logo href="/" />
      </div>
    </header>
  );
}
