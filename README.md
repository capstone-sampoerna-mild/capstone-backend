# API Gateway Capstone Backend

Backend ini adalah API Gateway berbasis Express.js yang menjadi penghubung antara frontend dan layanan AI. Aplikasi ini mengelola request masuk, melakukan validasi ringan, meneruskan request ke FastAPI, serta mengembalikan respons yang konsisten dan aman.

## Ringkasan Peran

- Pintu masuk utama dari frontend ke ekosistem layanan AI.
- Verifikasi login Google via Firebase ID token.
- Proxy request ke layanan AI untuk chat stream, rekomendasi job role, dan pemrosesan dokumen PDF.
- Menyediakan konsistensi respons dan error handling yang aman.

## Arsitektur Tingkat Tinggi

```
Frontend
  |
  v
Express API Gateway
  |-- Middleware (CORS, Helmet, Logging)
  |-- Routes (v1)
  |-- Controllers
  |-- Proxy ke FastAPI
  v
capstone-ai-service (FastAPI)
```

## Alur Request Umum

1. Request masuk ke Express.
2. Middleware berjalan: keamanan (helmet), CORS, parsing body, request logging.
3. Route v1 menentukan controller yang sesuai.
4. Controller melakukan validasi minimal dan menyiapkan payload.
5. Proxy meneruskan request ke FastAPI dengan timeout terkontrol.
6. Respons FastAPI diteruskan apa adanya.
7. Jika terjadi error, middleware errorHandler mengembalikan pesan profesional yang aman.

## Komponen Kode Penting

- Entry point aplikasi: inisialisasi middleware, routes, swagger, dan error handler.
- Router v1: mengelompokkan endpoint berdasarkan versi.
- Controller: logika validasi dan pemetaan payload sebelum proxy.
- Proxy util: menangani forwarding HTTP ke FastAPI (JSON, stream, multipart).
- Middleware error: menyamarkan error internal dan menghindari bocor detail sistem.

## Endpoint (v1)

| Method | Path                                     | Keterangan                                    |
| ------ | ---------------------------------------- | --------------------------------------------- |
| GET    | /api/v1/health                           | Status server dan info runtime                |
| POST   | /api/v1/auth/google                      | Verifikasi login Google via Firebase ID token |
| POST   | /api/v1/chat/ai/stream                   | Proxy chat stream (SSE) ke FastAPI            |
| POST   | /api/v1/job-role/recommend               | Rekomendasi job role (model lokal)            |
| POST   | /api/v1/job-role/recommend/gemini        | Rekomendasi job role via Gemini               |
| POST   | /api/v1/job-role/recommend/stream        | Stream rekomendasi job role (SSE)             |
| POST   | /api/v1/job-role/recommend/gemini/stream | Stream rekomendasi job role via Gemini (SSE)  |
| POST   | /api/v1/document/upload                  | Upload CV atau sertifikat PDF ke layanan AI   |

## Upload Dokumen (CV dan Sertifikat)

Endpoint dokumen sekarang hanya satu. Gunakan endpoint yang sama untuk CV atau sertifikat, satu file per request.

Field multipart yang diterima:

- file: file PDF (utama, wajib jika tidak memakai cv atau certificate)
- cv: file PDF (opsional, gunakan salah satu saja)
- certificate: file PDF (opsional, gunakan salah satu saja)
- documentType: cv | certificate (opsional, untuk memberi label di frontend)

Catatan: hanya satu file yang boleh dikirim dalam satu request. Jika perlu mengirim CV dan sertifikat, lakukan dua request ke endpoint yang sama.

Contoh upload CV:

```bash
curl -X POST http://localhost:5000/api/v1/document/upload \
  -F "cv=@/path/to/cv.pdf" \
  -F "documentType=cv"
```

Contoh upload sertifikat:

```bash
curl -X POST http://localhost:5000/api/v1/document/upload \
  -F "certificate=@/path/to/certificate.pdf" \
  -F "documentType=certificate"
```

## Integrasi dengan capstone-ai-service

Gateway ini meneruskan request ke layanan AI sesuai konfigurasi path di environment. Untuk endpoint dokumen, target upstream adalah path FastAPI seperti `/document/predict-pdf`.

Mapping utama:

- FASTAPI_CHAT_STREAM_PATH -> /chat-ai/chat-ai/stream
- FASTAPI_JOB_ROLE_RECOMMEND_PATH -> /job-role/job-role/recommend
- FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_PATH -> /job-role/job-role/recommend/gemini
- FASTAPI_JOB_ROLE_RECOMMEND_STREAM_PATH -> /job-role/job-role/recommend/stream
- FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_STREAM_PATH -> /job-role/job-role/recommend/gemini/stream
- FASTAPI_DOCUMENT_UPLOAD_PATH -> /document/predict-pdf

Jika path di layanan AI berubah, sesuaikan nilai env di gateway tanpa mengubah kode.

## Error Handling

- Error 4xx: mengembalikan pesan validasi yang relevan.
- Error 5xx: pesan disamarkan agar tidak membocorkan detail sistem.

Contoh respons error 5xx:

```json
{
  "status": "error",
  "message": "Terjadi kendala teknis di server. Silakan coba lagi nanti.",
  "timestamp": "2024-04-08T10:30:00Z"
}
```

## Struktur Project

```
src/
  config/          Konfigurasi environment dan swagger
  constants/       Konstanta aplikasi
  controllers/     Logic handler endpoint
  middlewares/     CORS, logging, error handling
  routes/          Definisi route API
  schemas/         Template schema respons
  utils/           Proxy FastAPI, formatter respons, util auth Firebase
```

## Quick Start

1. Install dependency:

```bash
npm install
```

2. Siapkan env:

```bash
cp .env.example .env
```

3. Jalankan server:

```bash
npm run dev
```

## Konfigurasi Environment

Variabel penting di `.env`:

- PORT=5000
- HOST=0.0.0.0
- NODE_ENV=development
- API_VERSION=v1
- CORS_ORIGIN=http://localhost:3000
- FASTAPI_BASE_URL=http://127.0.0.1:8001
- FASTAPI_CHAT_STREAM_PATH=/chat-ai/chat-ai/stream
- FASTAPI_JOB_ROLE_RECOMMEND_PATH=/job-role/job-role/recommend
- FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_PATH=/job-role/job-role/recommend/gemini
- FASTAPI_JOB_ROLE_RECOMMEND_STREAM_PATH=/job-role/job-role/recommend/stream
- FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_STREAM_PATH=/job-role/job-role/recommend/gemini/stream
- FASTAPI_DOCUMENT_UPLOAD_PATH=/document/predict-pdf
- FASTAPI_TIMEOUT_MS=60000
- FIREBASE_PROJECT_ID=your-firebase-project-id

Catatan: repo AI saat ini memakai prefix ganda pada beberapa route (contoh /job-role/job-role/recommend). Jika FastAPI Anda memakai path yang lebih pendek (misal /job-role/recommend), cukup ubah nilai FASTAPI\_\*\_PATH di .env.

## Akses

- Swagger: http://localhost:5000/api-docs/
- Health: http://localhost:5000/api/v1/health

## Script NPM

- npm run dev: development (nodemon)
- npm start: production

## Troubleshooting Singkat

- Swagger tidak bisa fetch: pastikan URL benar dan server berjalan.
- Chat stream atau job role tidak merespons: cek FastAPI dan FASTAPI\_\*\_PATH.
- Login Google gagal: pastikan FIREBASE_PROJECT_ID sesuai proyek Firebase dan token berasal dari Google Sign-In.

## Lisensi

ISC
