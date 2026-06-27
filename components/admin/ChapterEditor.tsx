"use client"

import { useRef, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import ImageExt from "@tiptap/extension-image"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Code2,
  Minus,
  ImageIcon,
} from "lucide-react"

interface ChapterEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Toggle
      pressed={active}
      onPressedChange={onClick}
      size="xs"
      className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      {children}
    </Toggle>
  )
}

function ToolbarDivider() {
  return <Separator orientation="vertical" className="h-6 mx-0.5" />
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return fileToBase64(new File([blob], "image.png", { type: blob.type }))
}

export default function ChapterEditor({ content, onChange, placeholder }: ChapterEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertImage = useCallback((dataUrl: string) => {
    if (!editorRef.current) return
    editorRef.current.chain().focus().setImage({ src: dataUrl }).run()
  }, [])

  const handleFilePick = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith("image/")) {
        alert("File yang dipilih bukan gambar.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB.")
        return
      }
      const dataUrl = await fileToBase64(file)
      insertImage(dataUrl)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [insertImage],
  )

  const editorRef = useRef<Editor | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Mulai menulis konten chapter di sini...",
      }),
      ImageExt.configure({
        allowBase64: true,
        inline: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none h-full focus:outline-none prose-p:mb-3 prose-p:mt-0 prose-p:leading-7 prose-p:text-foreground prose-headings:mb-2 prose-headings:mt-6 prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-code:text-foreground prose-ol:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-img:rounded-lg prose-img:max-w-full prose-img:my-4 prose-img:block prose-img:mx-auto",
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items
        if (!items) return false
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault()
            const blob = item.getAsFile()
            if (!blob) continue
            blobToBase64(blob).then((dataUrl) => {
              insertImage(dataUrl)
            })
            return true
          }
        }
        return false
      },
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="rounded-lg border border-input bg-background flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-2 border-b border-input shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code2 className="size-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="size-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFilePick}
          className="hidden"
        />

        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="size-4" />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="size-4" />
          </ToolbarButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}
