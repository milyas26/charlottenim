"use client";

import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import ContactList from "@/components/layout/ContactList";

export default function ContactSupportPage() {
  return (
    <div className="font-ui min-h-screen pb-28">
      <TopBar backHref="/user" />
      <div className="max-w-[480px] mx-auto px-4">
        <div className="pt-2 pb-5">
          <h1 className="font-title text-[1.75rem] font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
            Hubungi Kami
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Ada kendala pembayaran atau pertanyaan seputar cerita? Kabari kami, ya.
          </p>
        </div>
        <ContactList />
      </div>

      <BottomNav />
    </div>
  );
}
