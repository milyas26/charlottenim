import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
  title: React.ReactNode
  description?: React.ReactNode
  backHref?: string
}

/** Page title for /nulis modules. Page actions live in the sticky header, never here. */
export function AdminPageTitle({ title, description, backHref }: Props) {
  return (
    <div className="flex items-start gap-3 pt-2 pb-1">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Kembali"
          className="mt-1 size-9 shrink-0 rounded-full bg-secondary flex items-center justify-center transition hover:brightness-95"
        >
          <ArrowLeft className="size-4" />
        </Link>
      )}
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold leading-tight text-foreground truncate">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  )
}
