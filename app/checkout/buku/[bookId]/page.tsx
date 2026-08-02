"use client";

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { fetchBookBySlug, useCreateBookPayment } from "@/lib/api/books"
import type { ShippingAddress } from "@/data/types"
import BottomNav from "@/components/layout/BottomNav"
import { Loader2, ArrowLeft, ChevronDown, MapPin, ShoppingCart } from "lucide-react"

const WILAYAH_API = "https://api-wilayah.vercel.app"

interface Province {
  id: string
  name: string
}

interface Regency {
  id: string
  name: string
  province_id: string
}

interface District {
  id: string
  name: string
  regency_id: string
}

export default function BookCheckoutPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookBySlug(bookId),
    enabled: !!bookId,
  })

  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    address: "",
    postalCode: "",
  })
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedRegency, setSelectedRegency] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  const [provinces, setProvinces] = useState<Province[]>([])
  const [regencies, setRegencies] = useState<Regency[]>([])
  const [districts, setDistricts] = useState<District[]>([])

  const [error, setError] = useState("")

  const createPayment = useCreateBookPayment()

  useEffect(() => {
    fetch(`${WILAYAH_API}/provinces.json`)
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProvince) {
      setRegencies([])
      setDistricts([])
      return
    }
    setSelectedRegency("")
    setSelectedDistrict("")
    fetch(`${WILAYAH_API}/regencies/${selectedProvince}.json`)
      .then((r) => r.json())
      .then(setRegencies)
      .catch(() => {})
  }, [selectedProvince])

  useEffect(() => {
    if (!selectedRegency) {
      setDistricts([])
      return
    }
    setSelectedDistrict("")
    fetch(`${WILAYAH_API}/districts/${selectedRegency}.json`)
      .then((r) => r.json())
      .then(setDistricts)
      .catch(() => {})
  }, [selectedRegency])

  const provinceName = provinces.find((p) => p.id === selectedProvince)?.name ?? ""
  const regencyName = regencies.find((r) => r.id === selectedRegency)?.name ?? ""
  const districtName = districts.find((d) => d.id === selectedDistrict)?.name ?? ""

  const validate = (): boolean => {
    if (!form.recipientName.trim()) { setError("Nama penerima wajib diisi"); return false }
    if (!form.phone.trim()) { setError("Nomor telepon wajib diisi"); return false }
    if (!selectedProvince) { setError("Provinsi wajib dipilih"); return false }
    if (!selectedRegency) { setError("Kota/Kabupaten wajib dipilih"); return false }
    if (!form.address.trim()) { setError("Alamat lengkap wajib diisi"); return false }
    if (!form.postalCode.trim()) { setError("Kode pos wajib diisi"); return false }
    return true
  }

  const handleSubmit = () => {
    setError("")
    if (!validate()) return

    const shippingAddress: ShippingAddress = {
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      provinceId: selectedProvince,
      provinceName,
      regencyId: selectedRegency,
      regencyName,
      districtId: selectedDistrict,
      districtName,
      postalCode: form.postalCode.trim(),
    }

    createPayment.mutate(
      { bookId, shippingAddress },
      {
        onSuccess: (data) => router.push(`/pesanan/${data.purchaseId}`),
        onError: (err) => setError(
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Gagal membuat pesanan"
        ),
      }
    )
  }

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <div className="flex-1 max-w-[480px] mx-auto w-full px-4 flex items-center justify-center pb-24">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Buku tidak ditemukan.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(book.price)

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <div className="flex-1 max-w-[480px] mx-auto w-full px-4 flex items-center justify-center pb-24">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Silakan login untuk melanjutkan pembelian.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-24">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft className="size-5" />
          </button>
          <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Kembali
          </p>
        </div>

        <h1
          className="text-lg font-bold mt-2 mb-6 font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          Checkout
        </h1>

        <div
          className="rounded-2xl p-4 mb-6 flex gap-3 items-start"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="size-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="size-6" style={{ color: "var(--accent)", opacity: 0.5 }} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {book.title}
            </p>
            {book.author && (
              <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{book.author}</p>
            )}
            <p className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: "var(--accent)" }}>
              {formattedPrice}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="size-5" style={{ color: "var(--accent)" }} />
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)]" style={{ color: "var(--foreground)" }}>
              Alamat Pengiriman
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Nama Penerima
              </label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
                placeholder="Nama lengkap"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                No. Telepon
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="0812-3456-7890"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Provinsi
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none transition-colors"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: "var(--muted)" }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Kota/Kabupaten
              </label>
              <select
                value={selectedRegency}
                onChange={(e) => setSelectedRegency(e.target.value)}
                disabled={!selectedProvince}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {regencies.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Kecamatan
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedRegency}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none appearance-none disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Alamat Lengkap
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Nama jalan, RT/RW, dll."
                rows={3}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--muted)" }}>
                Kode Pos
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                placeholder="12345"
                maxLength={5}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-3 mb-6 flex items-start gap-2"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            Harga belum termasuk ongkos kirim. Setelah pesanan dibuat, hubungi admin via WhatsApp untuk info ongkir.
          </div>
        </div>

        {error && (
          <p className="text-xs mb-4 text-red-500">{error}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Total Harga Buku</span>
          <span className="text-xl font-bold font-[family-name:var(--font-display)]" style={{ color: "var(--accent)" }}>{formattedPrice}</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={createPayment.isPending}
          className="w-full py-3 px-8 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {createPayment.isPending ? "Membuat Pesanan..." : "Buat Pesanan"}
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
