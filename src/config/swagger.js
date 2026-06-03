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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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
        AuthRefreshRequest: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
            },
          },
          required: ['refreshToken'],
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
            skillset: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Daftar skill (contoh: ["python", "sql", "ml"])',
            },
          },
          required: ['skillset'],
        },
        JobRoleRecommendResponse: {
          type: 'object',
          properties: {
            top_roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string' },
                  confidence: { type: 'number' },
                  skill_gap: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        skill: { type: 'string' },
                        confidence: { type: 'number' },
                      },
                      required: ['skill', 'confidence'],
                    },
                  },
                },
                required: ['role', 'confidence', 'skill_gap'],
              },
            },
          },
          required: ['top_roles'],
        },
        DocumentUploadResponse: {
          $ref: '#/components/schemas/JobRoleRecommendResponse',
        },
        DocumentListResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok'],
            },
            message: {
              type: 'string',
              example: 'Documents retrieved',
            },
            data: {
              type: 'object',
              properties: {
                documents: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      user_id: { type: 'string' },
                      file_name: { type: 'string' },
                      file_url: { type: 'string' },
                      file_size_bytes: { type: 'integer', nullable: true },
                      created_at: { type: 'string', format: 'date-time' },
                    },
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
        UserSkillsetResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ok'],
            },
            message: {
              type: 'string',
              example: 'Skillset retrieved',
            },
            data: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                skills: {
                  type: 'array',
                  items: { type: 'string' },
                },
                updated_at: { type: 'string', format: 'date-time', nullable: true },
                created_at: { type: 'string', format: 'date-time', nullable: true },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['status', 'message', 'data', 'timestamp'],
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
