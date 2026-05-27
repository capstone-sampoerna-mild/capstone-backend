import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  fastApi: {
    baseUrl: process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8001',
    chatStreamPath: process.env.FASTAPI_CHAT_STREAM_PATH || '/chat-ai/chat-ai/stream',
    jobRoleRecommendPath:
      process.env.FASTAPI_JOB_ROLE_RECOMMEND_PATH || '/job-role/job-role/recommend',
    jobRoleRecommendGeminiPath:
      process.env.FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_PATH || '/job-role/job-role/recommend/gemini',
    jobRoleRecommendStreamPath:
      process.env.FASTAPI_JOB_ROLE_RECOMMEND_STREAM_PATH || '/job-role/job-role/recommend/stream',
    jobRoleRecommendGeminiStreamPath:
      process.env.FASTAPI_JOB_ROLE_RECOMMEND_GEMINI_STREAM_PATH ||
      '/job-role/job-role/recommend/gemini/stream',
    documentUploadPath:
      process.env.FASTAPI_DOCUMENT_UPLOAD_PATH || '/document/predict-pdf',
    timeoutMs: Number(process.env.FASTAPI_TIMEOUT_MS || 60000),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
  },
};
