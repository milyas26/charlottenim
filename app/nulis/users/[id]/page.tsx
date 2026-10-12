"use client"

import { IconBubble, StatusPill, orderStatusLabel, orderStatusTone, tint } from "@/components/admin/tint"
import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { Panel, EmptyState, InfoRow, PageLoader } from "@/components/admin/ui"
import { use } from "react"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingBag, ShoppingCart, Package, Wallet } from "lucide-react"
import { useAdminUserDetail } from "@/lib/api/admin"

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: user, isLoading } = useAdminUserDetail(id)

  if (isLoading) return <PageLoader />

  if (!user) notFound()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Detail user" backHref="/nulis/users" />

      <div className="grid gap-4 lg:grid-cols-3 items-start">
        <Panel className="lg:col-span-1">
          <div className="flex flex-col items-center text-center pt-2">
            <Avatar className="size-20">
              <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
              <AvatarFallback className="text-xl font-semibold" style={tint("brown")}>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.02em]">{user.name}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5 break-all">{user.email}</p>
            <StatusPill tone={user.role === "ADMIN" ? "brown" : "neutral"} className="mt-2.5">
              {user.role === "ADMIN" ? "Admin" : "Reader"}
            </StatusPill>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-[18px] bg-secondary p-3.5">
              <IconBubble tone="blue" className="size-8">
                <ShoppingBag className="size-4" />
              </IconBubble>
              <p className="mt-2.5 text-[20px] font-semibold leading-none tabular-nums">{user.totalPurchases}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">Pembelian</p>
            </div>
            <div className="rounded-[18px] bg-secondary p-3.5">
              <IconBubble tone="green" className="size-8">
                <Wallet className="size-4" />
              </IconBubble>
              <p className="mt-2.5 text-[20px] font-semibold leading-none tabular-nums truncate">
                <span className="text-[13px] font-medium text-muted-foreground mr-0.5">Rp</span>
                {user.totalSpent.toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">Total spent</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-border">
            <InfoRow label="Bergabung">
              {new Date(user.joinedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </InfoRow>
            <InfoRow label="Terakhir baca">{user.lastReadWork || "-"}</InfoRow>
          </div>
        </Panel>

        <Panel
          title="Riwayat pembelian"
          description={`${user.purchases.length} transaksi`}
          className="lg:col-span-2"
        >
          {user.purchases.length === 0 ? (
            <EmptyState icon={ShoppingCart} tone="green" title="Belum ada riwayat pembelian" />
          ) : (
            <ul className="space-y-1.5">
              {user.purchases.map((p) => {
                const tone = orderStatusTone[p.status] ?? "neutral"
                const Icon = p.type === "bundle" ? Package : ShoppingCart
                return (
                  <li
                    key={p.createdAt + p.userId + p.targetTitle}
                    className="flex items-center gap-3 rounded-[18px] p-2.5 transition-colors hover:bg-secondary"
                  >
                    <IconBubble tone={tone}>
                      <Icon className="size-[18px]" />
                    </IconBubble>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold truncate">{p.workTitle}</p>
                      <p className="text-[13px] text-muted-foreground truncate">
                        {p.type === "bundle" ? "Paket" : "Chapter"} · {p.targetTitle} ·{" "}
                        {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-[15px] font-semibold tabular-nums"
                        style={{ color: p.status === "FAILED" ? "var(--destructive)" : undefined }}
                      >
                        Rp {p.amount.toLocaleString("id-ID")}
                      </p>
                      <StatusPill tone={tone} className="mt-1 px-2 text-[11px]">
                        {orderStatusLabel[p.status] ?? p.status}
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
