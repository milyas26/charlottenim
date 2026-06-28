import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

export async function uploadFile(file: File, type: "CONTENT" | "COVER", workId: string, chapterId?: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("type", type)
  formData.append("workId", workId)
  if (chapterId) formData.append("chapterId", chapterId)

  const { data } = await api.post<{ url: string }>("/api/nulis/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.url
}

export async function uploadMultipleFiles(files: FileList, workId: string, chapterId?: string) {
  let success = 0
  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue
    if (file.size > 2 * 1024 * 1024) continue
    await uploadFile(file, "CONTENT", workId, chapterId)
    success++
  }
  return success
}

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, type, workId, chapterId }: {
      file: File
      type: "CONTENT" | "COVER"
      workId: string
      chapterId?: string
    }) => uploadFile(file, type, workId, chapterId),
  })
}

export function useUploadMultipleFiles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ files, workId, chapterId }: {
      files: FileList
      workId: string
      chapterId?: string
    }) => uploadMultipleFiles(files, workId, chapterId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["images", vars.workId, vars.chapterId] })
    },
  })
}
