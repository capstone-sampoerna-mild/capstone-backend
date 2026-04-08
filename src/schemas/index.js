/**
 * Request/Response Schemas for API Documentation
 * These schemas serve as templates for Swagger documentation and validation
 */

export const schemas = {
  // Pagination Schema
  pagination: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        example: 1,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        example: 20,
      },
      total: {
        type: 'integer',
        example: 100,
      },
      pages: {
        type: 'integer',
        example: 5,
      },
    },
  },

  // Success Response Template
  successResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['ok'],
        example: 'ok',
      },
      message: {
        type: 'string',
        example: 'Operation successful',
      },
      data: {
        type: 'object',
        description: 'Response payload',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-04-08T10:30:00Z',
      },
    },
    required: ['status', 'message', 'timestamp'],
  },

  // Error Response Template
  errorResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['error'],
        example: 'error',
      },
      message: {
        type: 'string',
        example: 'An error occurred',
      },
      error: {
        type: 'object',
        description: 'Error details (only in development)',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-04-08T10:30:00Z',
      },
    },
    required: ['status', 'message', 'timestamp'],
  },

  // Paginated Response Template
  paginatedResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['ok'],
        example: 'ok',
      },
      message: {
        type: 'string',
        example: 'Data retrieved successfully',
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
      pagination: {
        $ref: '#/components/schemas/Pagination',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['status', 'message', 'data', 'pagination', 'timestamp'],
  },
};

export default schemas;
