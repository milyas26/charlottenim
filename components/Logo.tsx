import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  href?: string;
  compact?: boolean;
  className?: string;
}

export default function Logo({ href = "/", compact, className }: LogoProps) {
  const content = (
    <>
      {!compact && (
        <span
          aria-hidden="true"
          className="text-[16px] leading-none opacity-30 transition-all duration-700 ease-out group-hover:opacity-80 group-hover:rotate-[16deg] group-hover:scale-110"
          style={{ color: "var(--accent)" }}
        >
          ✦
        </span>
      )}

      <Image
        src="/charlottenim-logo.png"
        alt="Charlottenimmm"
        width={32}
        height={32}
        className={
          "h-8 w-auto transition-all duration-700 ease-out group-hover:scale-[1.08]"
        }
      />

      <span className="relative inline-block">
        <span
          className={
            "text-lg italic tracking-[-0.01em] font-[family-name:var(--font-lora)] transition-colors duration-700 ease-out"
          }
          style={
            compact
              ? undefined
              : { color: "var(--foreground)", fontWeight: 450 }
          }
        >
          Charlottenimmm
        </span>
        <span
          className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
          style={{
            background: "linear-gradient(to right, var(--accent), transparent)",
          }}
        />
      </span>
    </>
  );

  const wrapperClassName = `group inline-flex items-center ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClassName}>
        {content}
      </Link>
    );
  }

  return <span className={wrapperClassName}>{content}</span>;
}
