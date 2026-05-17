# API Gateway Capstone Backend

Backend ini adalah API Gateway berbasis Express.js untuk kebutuhan capstone. Fungsinya sebagai pintu masuk utama untuk frontend, menangani dokumentasi API, keamanan dasar, login Google via Firebase, dan proxy ke service FastAPI.

## Fitur

- Swagger docs di `/api-docs`
- Health check untuk monitoring
- Login Google via Firebase (verifikasi ID token)
- Proxy endpoint FastAPI: chat stream, job role, dan upload dokumen
- CORS, helmet, logging, dan error handling terpusat

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

## Akses

- Swagger: `http://localhost:5000/api-docs/`
- Health: `http://localhost:5000/api/v1/health`

Jika di LAN, ganti `localhost` dengan IP mesin.

## Daftar Endpoint (v1)

| Method | Path                                       | Keterangan                                    |
| ------ | ------------------------------------------ | --------------------------------------------- |
| GET    | `/api/v1/health`                           | Status server dan info runtime                |
| POST   | `/api/v1/auth/google`                      | Verifikasi login Google via Firebase ID token |
| POST   | `/api/v1/chat/ai/stream`                   | Proxy chat stream (SSE) ke FastAPI            |
| POST   | `/api/v1/job-role/recommend`               | Rekomendasi job role (model lokal)            |
| POST   | `/api/v1/job-role/recommend/gemini`        | Rekomendasi job role via Gemini               |
| POST   | `/api/v1/job-role/recommend/stream`        | Stream rekomendasi job role (SSE)             |
| POST   | `/api/v1/job-role/recommend/gemini/stream` | Stream rekomendasi job role via Gemini (SSE)  |
| POST   | `/api/v1/document/upload`                  | Upload PDF untuk processing                   |

## Login Google (Firebase)

Backend ini tidak memakai Admin SDK. Frontend harus login pakai Firebase Auth (Google Sign-In), ambil `idToken`, lalu kirim ke backend.

Request:

```bash
curl -X POST http://localhost:5000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<FIREBASE_ID_TOKEN>"}'
```

Respons berisi data user yang sudah diverifikasi dan metadata Firebase.

## Chat Stream

Proxy ke FastAPI chat stream, format SSE mengikuti upstream.

```bash
curl -N -X POST http://localhost:5000/api/v1/chat/ai/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Buat roadmap belajar data analyst 3 bulan"}'
```

## Job Role Recommendation

Request memakai `name` (alias `nama` juga diterima) dan `skillset`.

```bash
curl -X POST http://localhost:5000/api/v1/job-role/recommend \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","skillset":["React","NextJS"]}'
```

Endpoint stream (`/stream`) mengirim SSE dari upstream.

## Upload Dokumen (PDF)

Field multipart harus bernama `file`. Hanya PDF yang diterima oleh service FastAPI.

```bash
curl -X POST http://localhost:5000/api/v1/document/upload \
  -F "file=@/path/to/document.pdf"
```

## Konfigurasi Environment

Variabel penting di `.env`:

- `PORT=5000`
- `HOST=0.0.0.0`
- `NODE_ENV=development`
- `API_VERSION=v1`
- `CORS_ORIGIN=http://localhost:3000`
- `FASTAPI_BASE_URL=http://127.0.0.1:8001`
- `FASTAPI_CHAT_STREAM_PATH=/chat-ai/chat-ai/stream`
- `FASTAPI_JOB_ROLE_RECOMMEND_PATH=/job-role/job-role/recommend`
- `FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_PATH=/job-role/job-role/recommend/gemini`
- `FASTAPI_JOB_ROLE_RECOMMEND_STREAM_PATH=/job-role/job-role/recommend/stream`
- `FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_STREAM_PATH=/job-role/job-role/recommend/gemini/stream`
- `FASTAPI_DOCUMENT_UPLOAD_PATH=/document/upload`
- `FASTAPI_TIMEOUT_MS=60000`
- `FIREBASE_PROJECT_ID=your-firebase-project-id`

Catatan: repo AI saat ini memakai prefix ganda pada beberapa route (contoh `/job-role/job-role/recommend`).
Jika FastAPI Anda memakai path yang lebih pendek (misal `/job-role/recommend`), cukup ubah nilai `FASTAPI_*_PATH` di `.env`.

## Script NPM

- `npm run dev`: development (nodemon)
- `npm start`: production

## Troubleshooting Singkat

- Swagger tidak bisa fetch: pastikan URL benar dan server berjalan.
- Chat stream atau job role tidak merespons: cek FastAPI dan `FASTAPI_*_PATH`.
- Login Google gagal: pastikan `FIREBASE_PROJECT_ID` sesuai proyek Firebase dan token berasal dari Google Sign-In.

## Lisensi

ISC
