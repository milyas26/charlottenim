"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
        <a href="/" className="group inline-flex items-center gap-0">
          <span
            aria-hidden="true"
            className="text-[16px] leading-none opacity-30 transition-all duration-700 ease-out group-hover:opacity-80 group-hover:rotate-[16deg] group-hover:scale-110"
            style={{ color: "var(--accent)" }}
          >
            ✦
          </span>
          <img
            src="/charlottenim-logo.png"
            alt="Charlottenimmm"
            className="h-8 w-auto transition-all duration-700 ease-out group-hover:scale-[1.08]"
          />
          <span className="relative inline-block">
            <span
              className="text-lg italic tracking-[-0.01em] font-[family-name:var(--font-lora)] transition-colors duration-700 ease-out"
              style={{ color: "var(--foreground)", fontWeight: 450 }}
            >
              Charlottenimmm
            </span>
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{
                background:
                  "linear-gradient(to right, var(--accent), transparent)",
              }}
            />
          </span>
        </a>
      </div>
    </header>
  );
}
