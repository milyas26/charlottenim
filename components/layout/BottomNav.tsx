"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, ShoppingBag, User, LayoutDashboard } from "lucide-react";
import { hapticTap } from "@/lib/haptics";
import { useAuth } from "@/contexts/AuthContext";

function isActiveTab(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const items = useMemo(() => {
    const base = [
      { href: "/", label: "Home", icon: House },
      { href: "/shop", label: "Shop", icon: ShoppingBag },
    ];
    if (isAdmin) {
      base.push({ href: "/manage", label: "Manage", icon: LayoutDashboard });
    }
    base.push({ href: "/user", label: "Profile", icon: User });
    return base;
  }, [isAdmin]);

  if (pathname.startsWith("/baca/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl"
      style={{
        backgroundColor: "color-mix(in srgb, var(--background) 92%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const active = isActiveTab(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 size-16 rounded-lg transition-colors tap-feedback ${item.href === "/manage" ? "md:hidden" : ""}`}
              onClick={hapticTap}
              style={{
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              <item.icon
                size={20}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{
                  opacity: active ? 1 : 0.7,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
