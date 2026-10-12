interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="pt-8 pb-5">
      <h1 className="font-title text-[1.75rem] font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
