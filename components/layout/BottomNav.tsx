"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, ShoppingBag, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: House },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/user", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

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
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 size-16 rounded-lg transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "var(--muted)",
              }}
            >
              <item.icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{
                  opacity: isActive ? 1 : 0.7,
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
