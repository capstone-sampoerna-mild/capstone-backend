import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  fastApi: {
    baseUrl: process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8001',
    chatStreamPath: process.env.FASTAPI_CHAT_STREAM_PATH || '/chat-ai/stream',
    timeoutMs: Number(process.env.FASTAPI_TIMEOUT_MS || 60000),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};
