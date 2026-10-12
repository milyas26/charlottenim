import { cookies } from "next/headers"
import { apiFetch } from "@/lib/axios"
import type { AdminStats } from "@/data/admin-types"
import type { Work } from "@/data/types"
import type { Purchase } from "@/data/admin-types"
import type { PaginatedResponse } from "@/lib/api/admin"
import { RevenueCard } from "@/components/admin/RevenueCard"
import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { Panel, StatTile, EmptyState } from "@/components/admin/ui"
import {
  IconBubble,
  StatusPill,
  orderStatusLabel,
  orderStatusTone,
  workStatusLabel,
  workStatusTone,
  type Tone,
} from "@/components/admin/tint"
import { BookOpen, Users, Eye, BookMarked, ChevronRight, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

type WorkWithReads = Work & { totalReads: number }

async function getAdminCookie(): Promise<string | null> {
  try {
    const jar = await cookies()
    const raw = jar.get("user-data")?.value
    if (!raw) return null
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (parsed.role !== "ADMIN") return null
    return `user-data=${encodeURIComponent(JSON.stringify(parsed))}`
  } catch {
    return null
  }
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(new Date())
  )
  if (hour < 11) return "Selamat pagi"
  if (hour < 15) return "Selamat siang"
  if (hour < 19) return "Selamat sore"
  return "Selamat malam"
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60_000)
  if (min < 1) return "baru saja"
  if (min < 60) return `${min} menit lalu`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} hari lalu`
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" })
}

export default async function AdminDashboardPage() {
  const adminCookie = await getAdminCookie()
  if (!adminCookie) redirect("/")

  const [stats, works, ordersResult] = await Promise.all([
    apiFetch<AdminStats>("/api/nulis/stats", { cookie: adminCookie }),
    apiFetch<WorkWithReads[]>("/api/nulis/works", { cookie: adminCookie }),
    apiFetch<PaginatedResponse<Purchase>>("/api/nulis/orders", { cookie: adminCookie }),
  ])
  const purchases = ordersResult?.data ?? []
  const pending = purchases.filter((p) => p.status === "PENDING").length

  const statsCards: { title: string; value: string; icon: typeof BookOpen; tone: Tone; description: string }[] = [
    { title: "Karya", value: stats.totalWorks.toLocaleString("id-ID"), icon: BookOpen, tone: "orange", description: `${stats.ongoingCount} ongoing · ${stats.completedCount} selesai · ${stats.draftCount} draft` },
    { title: "Chapter", value: stats.totalChapters.toLocaleString("id-ID"), icon: BookMarked, tone: "teal", description: `${stats.freeChapters} gratis · ${stats.premiumChapters} premium` },
    { title: "Pembaca", value: stats.totalUsers.toLocaleString("id-ID"), icon: Users, tone: "blue", description: "User terdaftar" },
    { title: "Dibaca", value: stats.totalReads.toLocaleString("id-ID"), icon: Eye, tone: "indigo", description: "Kumulatif semua chapter" },
  ]

  const recentWorks = works.slice(0, 5)

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle
        title={`${greeting()}, Charlotte.`}
        description={
          pending > 0
            ? `Ada ${pending} transaksi menunggu verifikasi di antara order terbaru.`
            : "Semua aman. Ini ringkasan cerita dan transaksi terbaru."
        }
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2 min-h-[220px]">
          <RevenueCard
            totalRevenue={stats.totalRevenue}
            revenueByMonth={stats.revenueByMonth ?? []}
            variant="nulis"
          />
        </div>

        <div className="xl:col-span-3 grid gap-4 grid-cols-2">
          {statsCards.map((stat) => (
            <StatTile
              key={stat.title}
              icon={stat.icon}
              tone={stat.tone}
              label={stat.title}
              value={stat.value}
              hint={stat.description}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel
          title="Karya terbaru"
          description="5 karya terakhir yang ditambahkan"
          href="/nulis/karya"
          className="xl:col-span-3"
        >
          {recentWorks.length === 0 ? (
            <EmptyState icon={BookOpen} title="Belum ada karya" description="Karya baru akan muncul di sini." />
          ) : (
            <ul className="space-y-1.5">
              {recentWorks.map((work) => {
                const hasCover = work.coverUrl.startsWith("http") || work.coverUrl.startsWith("data:")
                return (
                  <li key={work.id}>
                    <Link
                      href={`/nulis/karya/${work.id}`}
                      className="flex items-center gap-3.5 rounded-[18px] p-2.5 transition-colors hover:bg-secondary"
                    >
                      {hasCover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={work.coverUrl} alt="" className="w-10 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <span className="w-10 h-14 rounded-lg shrink-0 bg-secondary flex items-center justify-center text-sm font-semibold text-muted-foreground">
                          {work.title.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold truncate">{work.title}</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">
                          {work.totalChapters} chapter · {(work.totalReads ?? 0).toLocaleString("id-ID")} dibaca
                        </p>
                      </div>
                      <StatusPill tone={workStatusTone[work.status]}>{workStatusLabel[work.status]}</StatusPill>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Transaksi terakhir"
          description="Pembelian chapter & paket terbaru"
          href="/nulis/orders"
          className="xl:col-span-2"
        >
          {purchases.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="Belum ada transaksi" tone="green" />
          ) : (
            <ul className="space-y-1.5">
              {purchases.slice(0, 6).map((purchase, i) => {
                const tone = orderStatusTone[purchase.status] ?? "neutral"
                const Icon = purchase.type === "bundle" ? Package : ShoppingCart
                return (
                  <li
                    key={`${purchase.createdAt}-${i}`}
                    className="flex items-center gap-3 rounded-[18px] p-2.5 transition-colors hover:bg-secondary"
                  >
                    <IconBubble tone={tone}>
                      <Icon className="size-[18px]" />
                    </IconBubble>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold truncate">{purchase.userName}</p>
                      <p className="text-[13px] text-muted-foreground truncate">
                        {purchase.targetTitle} · {timeAgo(purchase.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-[15px] font-semibold tabular-nums"
                        style={{ color: purchase.status === "FAILED" ? "var(--destructive)" : undefined }}
                      >
                        Rp {purchase.amount.toLocaleString("id-ID")}
                      </p>
                      <StatusPill tone={tone} className="mt-1 px-2 text-[11px]">
                        {orderStatusLabel[purchase.status] ?? purchase.status}
                      </StatusPill>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
