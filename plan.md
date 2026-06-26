# Plan: charlotenimmm Reader App

Aplikasi baca novel & AU (Alternate Universe) khusus creator **charlotenimmm**. Single-creator platform — hanya 1 admin yang upload karya, pembaca hanya bisa baca & beli chapter.

---

## Tech Stack

| Layer           | Teknologi                              |
|-----------------|----------------------------------------|
| Framework       | Next.js 16 (App Router)                |
| Bahasa          | TypeScript                             |
| Styling         | Tailwind CSS 4                         |
| Database        | PostgreSQL                             |
| ORM             | Prisma                                 |
| Auth            | Firebase Authentication (Google OAuth)  |
| Payment         | Xendit Payment Gateway                 |
| Storage         | AWS S3 (untuk cover & ilustrasi)       |
| Deployment      | Vercel                                 |

---

## Database Schema (Prisma)

### Tabel Utama

- **User** — `id`, `email`, `name`, `avatarUrl`, `role` (READER | ADMIN), `firebaseUid`, `createdAt`
- **Work** — `id`, `title`, `slug` (auto dari title), `synopsis`, `coverUrl`, `genres` (string[], multi-enum), `status` (DRAFT | ONGOING | COMPLETED), `totalChapters`, `deletedAt` (soft delete), `createdAt`, `updatedAt`
- **Chapter** — `id`, `workId`, `chapterNumber` (auto-increment per work), `slug` (auto dari title), `title`, `content` (HTML dari rich text editor), `isPremium` (boolean), `price` (integer, IDR), `readCount` (integer, default 0), `deletedAt` (soft delete), `createdAt`, `updatedAt`
- **Purchase** — `id`, `userId`, `chapterId`, `amount`, `xenditPaymentId`, `status` (PENDING | PAID | FAILED), `createdAt`
- **Bookmark** — `id`, `userId`, `workId`, `createdAt`
- **ReadingProgress** — `id`, `userId`, `chapterId`, `lastReadAt` (hanya simpan chapter terakhir)

---

## Halaman / Route

### Public (Tanpa Login)

| Route                  | Deskripsi                              |
|------------------------|----------------------------------------|
| `/`                    | Landing page — list semua karya, tombol Login Google |
| `/karya/[slug]`        | Detail karya — sinopsis, list chapter, status premium |
| `/baca/[workSlug]/[chapterSlug]` | Halaman baca per chapter (scroll vertikal) |
| `/login`               | Halaman login — trigger Firebase Google sign-in popup |

### Reader (Setelah Login)

| Route                  | Deskripsi                              |
|------------------------|----------------------------------------|
| `/user`                | Halaman profil — data user, progress baca, bookmark |
| `/user/purchases`      | Daftar chapter yang sudah dibeli        |
| `/user/bookmarks`      | Daftar karya yang di-bookmark           |
| `/user/settings`       | Pengaturan akun                        |
| `/api/payment/create`  | Buat invoice Xendit untuk beli chapter |
| `/api/payment/callback`| Webhook Xendit — update status pembelian |

### Admin

| Route                     | Deskripsi                              |
|---------------------------|----------------------------------------|
| `/admin`                  | Dashboard — list semua karya admin     |
| `/admin/karya/baru`       | Upload karya baru + upload cover ke S3 |
| `/admin/karya/[slug]`     | Detail karya — list chapter            |
| `/admin/karya/[slug]/chapter/create` | Tambah chapter baru           |
| `/admin/karya/[slug]/chapter/[slug]` | Edit chapter                   |
| `/admin/users`            | List semua user, detail user + history pembelian |

---

## Fitur Detail

### 1. Landing Page (`/`)
- Hero section dengan cover karya terbaru
- Grid/list semua karya (hanya status ONGOING & COMPLETED, DRAFT tidak tampil)
- Setiap karya: cover, judul, genres, status
- Tombol "Login with Google" di header/navbar
- Search bar (search by judul)
- Responsive: mobile-first, semua halaman public mobile-friendly

### 2. Detail Karya (`/karya/[slug]`)
- Cover besar + sinopsis
- Info genres, total chapter, status
- List semua chapter dengan indikator: gratis / premium (harga)
- Tombol "Mulai Baca" (redirect ke chapter 1) atau "Lanjutkan" (kalau ada progress, khusus user login)
- Chapter gratis bisa dibaca tanpa login

### 3. Halaman Baca (`/baca/[workSlug]/[chapterSlug]`)
- **HANYA tampilan mobile** (max-width 480px), desktop/laptop tidak di-support
- **Mode scroll vertikal** — konten chapter di-scroll ke bawah
- **Customization** (opsional, toggle panel): font size (small/medium/large), line spacing, dark mode
- Navigasi: Prev Chapter / Next Chapter di bagian bawah
- Info chapter: judul, nomor chapter
- Chapter gratis bisa dibaca tanpa login, konten utuh langsung tampil
- Chapter premium: jika user belum login atau belum beli → tampilkan preview (beberapa paragraf pertama) lalu blur/paywall + tombol "Beli Chapter (Rp XXXX)" + redirect login kalau belum login
- Progress baca hanya simpan chapter terakhir yang dibaca (chapterSlug), bukan scroll position

### 4. Auth (Firebase Authentication — Google OAuth)
- Login/Register via Google menggunakan Firebase Authentication
- `firebase` SDK di client-side untuk popup login Google
- `firebase-admin` SDK di server-side untuk verifikasi token & session management
- Token ID Firebase dikirim ke backend → verifikasi → create/update user di database
- Role otomatis `READER` saat login pertama
- Role `ADMIN` di-set manual via database berdasarkan `firebaseUid`
- Auth state disimpan di cookie/session via `firebase-admin` `createSessionCookie`
- Middleware Next.js proteksi route `/admin/*` hanya untuk role ADMIN

### 5. Pembayaran (Xendit)
- Flow: User klik "Beli Chapter" → backend create invoice Xendit → redirect ke halaman pembayaran Xendit → callback webhook update status → chapter terbuka
- Tabel `Purchase` mencatat semua transaksi
- Halaman `/user/purchases` menampilkan riwayat pembelian

### 6. Halaman User
- Profil: nama, email, avatar (dari Google)
- Progress baca terakhir (lanjutkan baca)
- Daftar chapter yang sudah dibeli
- Daftar karya yang di-bookmark
- Statistik: total chapter dibaca, total pembelian

### 7. Bookmark
- User bisa bookmark/tandai karya favorit dari halaman detail karya
- Tombol bookmark di `/karya/[slug]`
- List bookmark muncul di `/user` dan `/user/bookmarks`
- Unbookmark juga via tombol yang sama (toggle)

### 8. Admin Panel
- **HANYA tampilan desktop/laptop** (admin tidak diakses via mobile)
- **Dashboard**: list semua karya (termasuk DRAFT) dengan pagination
- **Upload Karya**: title (slug auto-generate), sinopsis, genres (multi-select, maksimal 5), status (DRAFT/ONGOING/COMPLETED), upload cover ke S3 (max 100KB, auto-compress)
- **Upload Chapter**: title (slug auto-generate), chapterNumber auto-increment per work, content via HTML rich text editor (tiptap) dengan auto-save saat user idle (berhenti mengetik 2 detik), toggle premium, harga
- **Edit/Hapus Chapter**: soft delete (`deletedAt`), bisa restore
- **Reorder Chapter**: admin bisa drag-and-drop ganti urutan chapter, auto-update `chapterNumber`
- **List User**: lihat semua user, detail user termasuk history pembelian dan bookmark, dengan pagination
- **Read count**: admin bisa lihat jumlah pembaca per chapter di detail karya
- Soft delete karya → karya & chapter tidak tampil di public, tetap ada di database (bisa restore)

### 9. Upload Gambar (AWS S3)
- Upload cover karya via admin panel (maksimal 100KB per file)
- Client-side image compression sebelum upload: kalau file >100KB, resize/compress otomatis pakai canvas API
- Upload ilustrasi dalam chapter via HTML editor (optional, dengan batasan 100KB juga)
- Gunakan presigned URL atau direct upload via `@aws-sdk/client-s3`

---

## API Routes

| Endpoint                                | Method   | Deskripsi                         |
|-----------------------------------------|----------|-----------------------------------|
| `/api/auth/login`                       | POST     | Terima Firebase token → buat session cookie |
| `/api/auth/logout`                      | POST     | Hapus session cookie              |
| `/api/auth/session`                     | GET      | Cek session user (current user)   |
| `/api/works`                            | GET      | List semua karya (dengan pagination) |
| `/api/works/[slug]`                     | GET      | Detail karya                      |
| `/api/works/[slug]/chapters`            | GET      | List chapter per karya            |
| `/api/works/[workSlug]/chapters/[chapterSlug]` | GET      | Isi chapter + increment readCount (gratis: public, premium: authorized) |
| `/api/admin/works`                      | POST     | Upload karya baru (admin)         |
| `/api/admin/works/[id]`                 | PUT/DEL  | Edit/soft-delete karya (admin)    |
| `/api/admin/works/[id]/chapters`         | POST     | Tambah chapter (admin)            |
| `/api/admin/works/[id]/chapters/[cid]`   | PUT/DEL  | Edit/hapus chapter (admin)        |
| `/api/admin/works/[id]/chapters/reorder` | POST     | Reorder chapter urutan (admin)    |
| `/api/payment/create`                   | POST     | Buat invoice Xendit (redirect)    |
| `/api/payment/callback`                 | POST     | Webhook Xendit                    |
| `/api/upload`                           | POST     | Upload + compress file ke S3 (admin) |
| `/api/user/progress`                    | POST     | Save reading progress             |
| `/api/user/purchases`                   | GET      | List user purchases               |
| `/api/user/bookmarks`                   | GET      | List user bookmarks               |
| `/api/user/bookmarks/[workId]`          | POST/DEL | Toggle bookmark karya             |
| `/api/admin/users`                      | GET      | List semua user (admin, pagination) |
| `/api/admin/users/[id]`                 | GET      | Detail user + purchases (admin)   |

---

## Implementation Order

1. **Setup project** — install dependencies, setup PostgreSQL, Prisma schema, env vars
2. **Auth system** — Firebase Auth Google provider, session cookie via firebase-admin, middleware
3. **Landing page** — `/` tampilan list karya (mobile-first)
4. **Detail karya** — `/karya/[slug]` (mobile-first)
5. **Halaman baca** — `/baca/[workSlug]/[chapterSlug]` scroll vertikal mobile-only + customization panel, chapter gratis public akses
6. **Admin panel** — CRUD karya + chapter + tiptap editor + auto-save + reorder + upload cover S3 (desktop-only)
7. **Payment system** — Xendit invoice redirect, webhook callback
8. **User dashboard** — profil, progress, purchases, bookmark
9. **Admin user management** — list user + detail + pagination
10. **Polish & deploy** — SEO + Open Graph meta, loading states, halaman 404, error boundary, pagination, rate limiting, deploy Vercel

---

## Dependencies (npm)

```
prisma @prisma/client
firebase firebase-admin
@aws-sdk/client-s3 @aws-sdk/s3-request-presigner
xendit-node
@tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-link
@tailwindcss/typography
zod (validasi)
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_S3_BUCKET="..."
XENDIT_API_KEY="..."
XENDIT_CALLBACK_TOKEN="..."
NEXT_PUBLIC_APP_URL="..."
```

---

## Non-Functional Requirements

- **Mobile-first**: halaman public (landing, detail, baca) optimal di mobile (max-width 480px untuk halaman baca). Admin panel di desktop (min-width 1024px)
- **Image compression**: client-side compress sebelum upload S3, max 100KB per cover image
- **Pagination**: list karya, list chapter, admin list user pakai cursor-based atau offset pagination
- **404 / Error boundary**: custom 404 page, error boundary di tiap halaman
- **Reading customization**: panel di halaman baca — font size (small/medium/large), line spacing, dark mode toggle. Disimpan di localStorage
- **Rate limiting**: semua API endpoint dibatasi via `next-rate-limit` atau middleware custom (per IP / per user)
- **SEO & Open Graph**: meta tag dinamis per karya (cover, judul, sinopsis) dan per chapter untuk social sharing (Twitter/X, WhatsApp preview)
- **Soft delete**: hapus karya/chapter → `deletedAt` timestamp, data tetap ada di DB, tidak tampil di public. Admin bisa restore
- **Security**: Firebase session cookie httpOnly, CSRF protection, Xendit webhook signature verification
- **Auto-save**: editor tiptap auto-save konten chapter saat user idle (berhenti mengetik 2 detik) ke localStorage, cegah kehilangan data
