# API Gateway Capstone Backend

Backend ini adalah API Gateway berbasis Express.js untuk proyek **AI-Driven Career Pathing & Skills Gap Analyzer**. Gateway bertugas menangani routing, dokumentasi API, keamanan dasar, serta proxy ke service FastAPI.

## Ringkasan Fitur Terbaru

- Struktur modular: `routes`, `controllers`, `middlewares`, `config`
- Dokumentasi API otomatis dengan Swagger (`swagger-jsdoc` + `swagger-ui-express`)
- Endpoint health check: `GET /api/v1/health`
- Integrasi FastAPI chat stream: `POST /api/v1/chat/ai/stream`
- Siap akses LAN (1 jaringan) dengan host `0.0.0.0`
- Pengamanan dasar dengan `helmet`, `cors`, dan `dotenv`
- Error handling terpusat dan logging request

## Struktur Proyek

```text
Backend/
├── src/
│   ├── config/
│   │   ├── environment.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── healthController.js
│   │   └── chatController.js
│   ├── middlewares/
│   │   ├── cors.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── routes/
│   │   ├── index.js
│   │   └── v1/
│   │       ├── index.js
│   │       ├── healthRoutes.js
│   │       └── chatRoutes.js
│   └── index.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Prasyarat

- Node.js 16+
- npm

## Instalasi

1. Install dependency:

```bash
npm install
```

2. Siapkan environment file:

```bash
cp .env.example .env
```

3. Jalankan server:

```bash
npm run dev
```

## Akses Aplikasi

- Lokal:
  - Swagger: `http://localhost:5000/api-docs/`
  - Health: `http://localhost:5000/api/v1/health`

- LAN (1 jaringan):
  - Swagger: `http://<IP-LAN-ANDA>:5000/api-docs/`
  - Health: `http://<IP-LAN-ANDA>:5000/api/v1/health`

Contoh:

`http://192.168.18.4:5000/api-docs/`

## Endpoint Utama

1. `GET /api/v1/health`
2. `POST /api/v1/chat/ai/stream`

Contoh request chat stream:

```bash
curl -N -X POST http://localhost:5000/api/v1/chat/ai/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Buat roadmap belajar data analyst 3 bulan"}'
```

## Integrasi FastAPI

Gateway mem-proxy request ke FastAPI endpoint chat stream.

Konfigurasi default:

- `FASTAPI_BASE_URL=http://127.0.0.1:8001`
- `FASTAPI_CHAT_STREAM_PATH=/chat-ai/stream`
- `FASTAPI_TIMEOUT_MS=60000`

Pastikan service FastAPI Anda aktif sebelum mencoba endpoint chat stream dari Swagger.

## Konfigurasi Environment

Variabel penting di `.env`:

- `PORT=5000`
- `HOST=0.0.0.0`
- `NODE_ENV=development`
- `API_VERSION=v1`
- `CORS_ORIGIN=http://localhost:3000`
- `FASTAPI_BASE_URL=http://127.0.0.1:8001`
- `FASTAPI_CHAT_STREAM_PATH=/chat-ai/stream`
- `FASTAPI_TIMEOUT_MS=60000`

## Script NPM

- `npm run dev`: Menjalankan server development (nodemon)
- `npm start`: Menjalankan server production mode

## Catatan Swagger dan CORS

- Swagger dikonfigurasi agar bisa diakses dari LAN.
- Server URL pada Swagger menggunakan same-origin (`/`) agar tombol Execute tidak mengarah ke host yang salah.
- Untuk menghindari blank page di sebagian browser, CSP pada route docs sudah disesuaikan.

## Troubleshooting Singkat

1. `Failed to fetch` di Swagger:
- Pastikan buka URL dengan format `http://<IP-LAN>:5000/api-docs/`
- Hard refresh browser (`Ctrl+Shift+R`)
- Pastikan server Swagger memakai dropdown server `/`

2. Chat stream tidak merespons:
- Cek apakah FastAPI aktif di `127.0.0.1:8001`
- Cek nilai `FASTAPI_BASE_URL` dan `FASTAPI_CHAT_STREAM_PATH`

3. Port sudah dipakai:
- Hentikan proses lama lalu jalankan ulang `npm run dev`

## Lisensi

ISC
