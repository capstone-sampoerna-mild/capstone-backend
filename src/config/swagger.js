import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './environment.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Career Pathing & Skills Gap Analyzer API',
      version: '1.0.0',
      description:
        'API Gateway for AI-Driven Career Pathing & Skills Gap Analyzer. Handles routing, authentication, and data orchestration for the capstone project.',
      contact: {
        name: 'Coding Camp Capstone Team',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Host (supports LAN and localhost)',
      },
      {
        url: `http://localhost:${config.port}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok', 'error'],
              example: 'ok',
            },
            message: {
              type: 'string',
              example: 'Server is running',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-04-08T10:30:00Z',
            },
            version: {
              type: 'string',
              example: 'v1',
            },
          },
          required: ['status', 'message', 'timestamp', 'version'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['error'],
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Internal Server Error',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['status', 'message', 'timestamp'],
        },
        ChatRequest: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              example: 'Buat roadmap belajar agar saya bisa jadi ML Engineer dalam 6 bulan.',
            },
          },
          required: ['prompt'],
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            detail: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  loc: {
                    type: 'array',
                    items: {
                      oneOf: [{ type: 'string' }, { type: 'integer' }],
                    },
                  },
                  msg: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        AuthGoogleRequest: {
          type: 'object',
          properties: {
            idToken: {
              type: 'string',
              description: 'Firebase ID token from Google sign-in',
            },
          },
          required: ['idToken'],
        },
        AuthGoogleResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok'],
              example: 'ok',
            },
            message: {
              type: 'string',
              example: 'Google login verified',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    uid: { type: 'string' },
                    email: { type: 'string', nullable: true },
                    name: { type: 'string', nullable: true },
                    picture: { type: 'string', nullable: true },
                    emailVerified: { type: 'boolean' },
                    provider: { type: 'string', example: 'google.com' },
                  },
                },
                firebase: {
                  type: 'object',
                  properties: {
                    authTime: { type: 'number', description: 'Unix time in seconds' },
                    signInProvider: { type: 'string', example: 'google.com' },
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['status', 'message', 'data', 'timestamp'],
        },
        JobRoleRecommendRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nama user (alias: nama)',
            },
            skillset: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Daftar skill (contoh: ["python", "sql", "ml"])',
            },
          },
          required: ['name'],
        },
        JobRoleRecommendResponse: {
          type: 'object',
          properties: {
            greeting: {
              type: 'string',
              example: 'Halo Budi!',
            },
            recommendation: {
              type: 'string',
              example: 'Berdasarkan skillset kamu, pekerjaan yang cocok untukmu adalah Data Analyst.',
            },
            predicted_role: {
              type: 'string',
              example: 'Data Analyst',
            },
            confidence: {
              type: 'number',
              nullable: true,
            },
          },
          required: ['greeting', 'recommendation', 'predicted_role'],
        },
        DocumentUploadResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Document processed and stored successfully.',
            },
            filename: {
              type: 'string',
              example: 'resume.pdf',
            },
            total_chunks: {
              type: 'number',
              example: 12,
            },
          },
          required: ['status', 'message', 'filename', 'total_chunks'],
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
