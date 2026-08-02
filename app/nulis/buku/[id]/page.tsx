"use client"

import { use } from "react"
import { Loader2 } from "lucide-react"
import { useAdminBook } from "@/lib/api/books"
import BookForm from "@/components/admin/BookForm"

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: book, isLoading } = useAdminBook(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Buku tidak ditemukan.</p>
      </div>
    )
  }

  return <BookForm initialBook={book} isEdit bookId={id} />
}
