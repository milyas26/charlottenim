"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import LoginDialog from "@/components/LoginDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 4;
      el.style.borderBottomColor = scrolled ? "var(--border)" : "transparent";
      el.style.backgroundColor = scrolled
        ? "color-mix(in srgb, var(--background) 88%, transparent)"
        : "transparent";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="font-ui sticky top-0 z-40 backdrop-blur-xl transition-colors duration-300"
      style={{ borderBottom: "1px solid transparent" }}
    >
      <div className="max-w-[480px] mx-auto px-4 h-14 flex items-center justify-between">
        <Logo href="/" />

        {loading ? (
          <div className="size-8 rounded-full bg-[var(--surface)] animate-pulse" />
        ) : user ? (
          <Link href="/user" aria-label="Profil" className="tap-feedback rounded-full">
            <Avatar className="size-8 ring-1 ring-[var(--border)]">
              <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" />
              <AvatarFallback className="text-xs font-semibold">
                {user.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <LoginDialog>
            <button
              className="text-[13px] font-semibold px-4 h-8 rounded-full tap-feedback transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              Masuk
            </button>
          </LoginDialog>
        )}
      </div>
    </header>
  );
}
