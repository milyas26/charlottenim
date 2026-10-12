"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, ShoppingBag, User, LayoutDashboard } from "lucide-react";
import { hapticTap } from "@/lib/haptics";
import { useAuth } from "@/contexts/AuthContext";

function isActiveTab(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/karya");
  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const items = useMemo(() => {
    const base = [
      { href: "/", label: "Beranda", icon: House },
      { href: "/shop", label: "Toko", icon: ShoppingBag },
    ];
    if (isAdmin) {
      base.push({ href: "/manage", label: "Kelola", icon: LayoutDashboard });
    }
    base.push({ href: "/user", label: "Profil", icon: User });
    return base;
  }, [isAdmin]);

  if (pathname.startsWith("/baca/")) return null;

  return (
    <nav
      className="font-ui fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--background) 92%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = isActiveTab(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 h-full tap-feedback`}
              onClick={hapticTap}
              style={{ color: active ? "var(--accent)" : "var(--muted)" }}
            >
              <span
                className="flex items-center justify-center h-7 w-14 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: active
                    ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                    : "transparent",
                }}
              >
                <item.icon size={19} strokeWidth={active ? 2.25 : 1.75} />
              </span>
              <span className={`text-[11px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
