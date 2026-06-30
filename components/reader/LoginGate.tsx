"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginGate() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center animate-page-enter"
      style={{ backgroundColor: "var(--rm-bg)" }}>
      <div className="w-[90vw] max-w-sm mx-auto text-center px-6 py-12">
        <Logo />

        <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--rm-muted)" }}>
          Kamu sudah membaca 2 bab. Masuk untuk melanjutkan membaca karya favoritmu.
        </p>

        <button
          type="button"
          onClick={async () => {
            try {
              await signInWithGoogle();
              router.refresh();
            } catch {}
          }}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-80 tap-feedback"
          style={{
            backgroundColor: "var(--rm-surface)",
            color: "var(--rm-fg)",
            border: "1.5px solid var(--rm-border)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  );
}
