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
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
