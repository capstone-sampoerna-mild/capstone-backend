/**
 * Application Constants
 * Centralized configuration for API gateway constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid request parameters',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  DUPLICATE_ENTRY: 'Duplicate entry',
  VALIDATION_FAILED: 'Validation failed',
};

export const API_VERSION = {
  V1: 'v1',
  V2: 'v2', // Future version
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const TIMEOUT = {
  REQUEST: 30000, // 30 seconds
  DATABASE: 10000, // 10 seconds
  EXTERNAL_API: 15000, // 15 seconds
};
