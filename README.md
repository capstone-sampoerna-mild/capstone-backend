# Career Pathing & Skills Analyzer - API Gateway (Backend)

Backend ini adalah **API Gateway** berbasis Express.js yang bertugas sebagai orkestrator utama dalam ekosistem aplikasi Career Pathing. Aplikasi ini menjembatani Frontend dengan layanan AI (FastAPI) dan Database relasional (Supabase PostgreSQL), sekaligus menangani proses autentikasi (Firebase Auth).

## ✨ Fitur-Fitur Sistem

Aplikasi ini telah berkembang dari sekadar proxy menjadi backend berfitur penuh dengan kapabilitas berikut:

- **Autentikasi Aman:** Login menggunakan Google Sign-In (Firebase Auth) dengan pengelolaan sesi via JWT (JSON Web Token).
- **Manajemen Profil & CV:** Memungkinkan user mengunggah CV (PDF) untuk diekstraksi informasinya (skill, edukasi, pengalaman) menggunakan AI (melalui FastAPI).
- **Rekomendasi Karier Cerdas (AI-Powered):** Memberikan rekomendasi peran pekerjaan (job role) yang cocok berdasarkan skill yang dimiliki user.
- **Analisis Kesenjangan Skill (Skill Gap Analysis):** Menganalisis perbedaan antara skill yang dimiliki user dengan skill yang dibutuhkan oleh suatu peran pekerjaan.
- **Personalized Learning Pathway:** Membuat jalur pembelajaran mandiri. User dapat melihat daftar skill yang harus dipelajari dan menandainya sebagai "Selesai" (checklist).
- **Manajemen Lowongan (Saved Jobs):** Menyimpan daftar pekerjaan atau karier yang diminati user.
- **Riwayat Aktivitas (History):** Melacak jejak interaksi user dengan aplikasi (misal: mencari karier, menyimpan profil).

## ⚙️ Cara Kerja Sistem (Workflow)

Berikut adalah urutan proses yang terjadi ketika sebuah *request* masuk ke sistem ini:

1. **Penerimaan Request:** Request dari frontend (React/Next.js) masuk ke Express API Gateway.
2. **Middleware Layer:** 
   - **Security:** `helmet` melindungi HTTP headers dari celah keamanan umum.
   - **CORS:** Mengatur origin mana yang diizinkan mengakses API (frontend).
   - **Logging & Parsing:** Mencatat log (aktivitas request) dan mem-parsing body request yang berformat JSON atau *Multipart* (untuk file PDF).
3. **Autentikasi (Firebase & JWT):** 
   - Gateway menerima Firebase ID Token hasil login Google.
   - Gateway memverifikasi token tersebut ke server Firebase Admin.
   - Jika valid, sistem mencari/membuat data user di Supabase dan menerbitkan sesi login mandiri berupa `Access Token` & `Refresh Token` (JWT).
4. **Pemrosesan di Controller (Bercabang):**
   - **Data Lokal (Supabase):** Request yang berhubungan dengan *database* (seperti menyimpan profil, menyusun *career pathway*, mencentang skill yang sudah dipelajari, menyimpan loker, atau mencatat riwayat) akan diproses langsung ke Supabase PostgreSQL menggunakan library `supabase-js`.
   - **Pemrosesan AI (FastAPI Proxy):** Request yang membutuhkan inferensi atau pemrosesan berat dari AI (seperti mengunggah dokumen CV untuk *parsing*, menghasilkan rekomendasi, atau berinteraksi dengan Chatbot secara *streaming*) akan di-*forward* (di-proxy) ke layanan AI (FastAPI) menggunakan utilitas `fastApiProxy`.
5. **Standardisasi Respons:** Sebelum dikembalikan ke frontend, semua *response* akan melalui _middleware error handling_. Hal ini memastikan respons sukses/error memiliki format yang konsisten (`status`, `message`, `data`) serta menyembunyikan detail _error internal_ agar lebih aman.

## 🏗️ Arsitektur Tingkat Tinggi

```text
Frontend (Client)
      |
      v (REST API / SSE)
+---------------------------------------------------+
|               Express API Gateway                 |
| - Authentication & Authorization (Firebase & JWT) |
| - API Routing (v1)                                |
| - Controllers (Logika Bisnis & Validasi)          |
+---------------------------------------------------+
      |                                       |
      | (CRUD via Supabase Client)            | (Proxy via Axios/Fetch)
      v                                       v
+-----------------------+           +-------------------------+
| Supabase (PostgreSQL) |           | FastAPI (AI Service)    |
| - users, profiles     |           | - Model Rekomendasi     |
| - careers, pathways   |           | - NLP / Chat Stream     |
| - saved_jobs, history |           | - PDF Extractor         |
+-----------------------+           +-------------------------+
```

## 📂 Daftar Lengkap API Endpoint (v1)

Berikut adalah daftar endpoint RESTful yang tersedia di sistem ini beserta fungsinya:

### 1. Autentikasi (`/api/v1/auth`)
- `POST /auth/google`: Melakukan login menggunakan Firebase ID Token. Jika user baru, sistem otomatis membuatkan profil di database. Mengembalikan token JWT untuk sesi (Access & Refresh token).
- `POST /auth/refresh`: Memperbarui Access Token yang sudah kedaluwarsa dengan menggunakan Refresh Token.

### 2. Dokumen & CV (`/api/v1/document`)
- `POST /document/upload`: Mengunggah file CV atau Sertifikat berbentuk PDF. File diteruskan ke AI untuk diekstraksi isi teksnya menjadi skillset, pengalaman, dan edukasi, lalu disimpan ke profil user.
- `GET /document`: Menarik daftar riwayat dokumen yang sudah diunggah sebelumnya.

### 3. Profil Pengguna (`/api/v1/profile`)
- `GET /profile/skillset`: Menarik data seluruh *skillset* (keahlian) yang telah tersimpan di profil pengguna (hasil dari unggahan CV atau input manual).

### 4. Rekomendasi Pekerjaan (*Job & Role*) (`/api/v1/job-role` & `/api/v1/jobs`)
- `POST /job-role/recommend`: Meminta AI untuk merekomendasikan peran pekerjaan (Job Role) yang paling relevan dengan profil/skillset pengguna.
- `POST /jobs/recommendations`: Mengambil rekomendasi postingan lowongan kerja nyata (dari database `job_data`) yang sesuai dengan *skillset* pengguna.

### 5. Peta Jalan Karier (*Career Roadmap*) (`/api/v1/career`)
- `POST /career/roadmap`: Meminta AI membuat *learning roadmap* (peta pembelajaran) atau *skill gap analysis* dari *skill* yang dimiliki user ke *skill* target untuk sebuah peran pekerjaan spesifik.

### 6. Jalur Pembelajaran (*Pathway*) (`/api/v1/pathway`)
- `POST /pathway`: Menyimpan/menambahkan sebuah keahlian (skill) ke dalam daftar jalur pembelajaran pengguna (semacam *To-Do List* belajar).
- `GET /pathway/:userId`: Menarik semua daftar *skill* yang masuk ke dalam jalur pembelajaran pengguna.
- `PATCH /pathway/:id/status`: Memperbarui status suatu *skill* dalam *pathway* (misalnya dari status sedang dipelajari menjadi "Selesai/Lulus").
- `DELETE /pathway/:id`: Menghapus suatu *skill* dari jalur pembelajaran.
- `DELETE /pathway/user/:userId/reset`: Menghapus/mereset secara keseluruhan *pathway* milik pengguna.

### 7. Riwayat Aktivitas (`/api/v1/history`)
- `GET /history/progress/:userId`: Mengambil jejak historis interaksi, eksplorasi, atau *progress* belajar pengguna pada sistem ini.

### 8. Asisten Chat AI (`/api/v1/chat`)
- `POST /chat/ai/stream`: Endpoint untuk berkomunikasi (chat) dengan model AI sebagai konsultan karier secara *real-time* (menggunakan arsitektur *Server-Sent Events / Streaming*).

### 9. Healthcheck (`/api/v1/health`)
- `GET /health`: Mengecek status stabilitas server API Gateway.

Dokumentasi lengkap interaktif API (lengkap dengan skema input/output payload) tersedia di **Swagger UI** melalui rute `/api-docs`.

---

## 💻 Panduan Menjalankan Project (Komprehensif)

Ikuti langkah-langkah di bawah ini untuk menjalankan server secara lokal.

### 1. Persiapan Kebutuhan Sistem
Pastikan Anda sudah menginstal:
- **Node.js** (versi 18.x atau lebih baru)
- **NPM** (Node Package Manager)

Anda juga membutuhkan akses ke layanan pihak ketiga:
- **Firebase Project** (Untuk autentikasi Google Sign-In)
- **Supabase Project** (Database PostgreSQL)
- **FastAPI Service** (Bisa dijalankan di localhost atau server eksternal)

### 2. Instalasi Dependensi
Clone repository ini dan masuk ke dalam folder, kemudian jalankan:
```bash
npm install
```

### 3. Konfigurasi Environment (Lingkungan)
Gandakan file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu, buka file `.env` dan lengkapi nilainya:

- **Server:** Atur `PORT` (default: 5000) dan `CORS_ORIGIN` (misalnya `http://localhost:3000`).
- **Firebase:** Isi `FIREBASE_PROJECT_ID` dengan ID project Firebase Anda. (Pastikan service account credential JSON sudah disiapkan jika di-require oleh script tambahan, namun umumnya cukup project ID jika setup SDK public).
- **JWT:** Berikan string acak untuk `JWT_SECRET` dan `JWT_REFRESH_SECRET`.
- **Supabase:** Isi `SUPABASE_URL` dengan URL project Supabase Anda dan `SUPABASE_SERVICE_ROLE_KEY` dengan kunci rahasia *service role* (ditemukan di pengaturan API Supabase).
- **FastAPI:** Isi `FASTAPI_BASE_URL` dan endpoint routes relevan agar proxy ke layanan AI dapat terhubung.

### 4. Setup Database (Supabase)
Backend ini mengandalkan skema database tertentu.
1. Masuk ke dashboard project **Supabase** Anda.
2. Buka tab **SQL Editor**.
3. Buka file `schema.sql` (jika tersedia di root project) atau jalankan migrasi yang telah disiapkan di folder `/migrations` atau `/schema.sql`.
4. Run query tersebut untuk membuat semua tabel (`users`, `profiles`, `careers`, `saved_jobs`, `pathways`, dll).

### 5. Menjalankan Server
Setelah konfigurasi selesai, jalankan server dalam mode *development*:
```bash
npm run dev
```
*(Server akan menggunakan `nodemon` sehingga merestart otomatis jika ada perubahan kode).*

Untuk mode *production*:
```bash
npm start
```

### 6. Verifikasi & Akses
Jika server berjalan dengan benar, Anda akan melihat log di terminal:
```text
🚀 Server running on http://localhost:5000
📚 API Documentation: http://localhost:5000/api-docs
🌍 Environment: development
```
- **Health Check:** `http://localhost:5000/api/v1/health`
- **Swagger Docs:** `http://localhost:5000/api-docs`

---

## 🛠️ Troubleshooting Singkat

- **Swagger tidak memuat data:** Pastikan `PORT` di URL sesuai dengan yang ada di terminal.
- **Login Gagal / Unauthorized:** 
  1. Pastikan `FIREBASE_PROJECT_ID` cocok.
  2. Pastikan ID token yang dikirim client benar-benar dihasilkan oleh Firebase Auth (valid dan belum expired).
- **Aksi Supabase Error (RLS / Permission Denied):** Gunakan `SUPABASE_SERVICE_ROLE_KEY` pada backend, **jangan** menggunakan `anon_key`, agar backend dapat mem-bypass Row Level Security.
- **Timeout dari Layanan AI:** Cek apakah server FastAPI berjalan dan `FASTAPI_BASE_URL` di `.env` bisa diakses dari terminal Anda (misal pakai `curl`).

---

## 📜 Lisensi
ISC
