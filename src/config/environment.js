import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  fastApi: {
    baseUrl: process.env.FASTAPI_BASE_URL || 'https://ai-service.skillsgap-ai.my.id',
    jobRoleRecommendPath:
      process.env.FASTAPI_JOB_ROLE_RECOMMEND_PATH || '/job-role/recommend',
    documentUploadPath: process.env.FASTAPI_DOCUMENT_UPLOAD_PATH || '/document/predict-pdf',
    githubExtractPath: process.env.FASTAPI_GITHUB_EXTRACT_PATH || '/document/predict-github',
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
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  jwt: {
    accessSecret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    accessTtlMinutes: Number(process.env.JWT_ACCESS_TTL_MINUTES || 15),
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS || 7),
  },
};
