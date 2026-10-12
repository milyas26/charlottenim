import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";

const contacts = [
  { icon: Mail, label: "Email", value: "charlottenimmm@gmail.com", href: "mailto:charlottenimmm@gmail.com" },
  { icon: Phone, label: "Telepon / WhatsApp", value: "+62 858-3061-0640", href: "tel:+6285830610640" },
  { icon: MapPin, label: "Alamat", value: "Karet, Setiabudi, Jakarta Selatan" },
];

export default function ContactList() {
  return (
    <ul className="soft-card rounded-2xl overflow-hidden">
      {contacts.map((c, i) => {
        const inner = (
          <>
            <span
              className="size-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <c.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                {c.label}
              </p>
              <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                {c.value}
              </p>
            </div>
            {c.href && <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)" }} />}
          </>
        );
        return (
          <li key={c.label} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            {c.href ? (
              <a href={c.href} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] tap-feedback">
                {inner}
              </a>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3.5">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
