/**
 * Custom API Error Class
 * Extends the native Error class with status code and additional properties
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, error = null) {
    super(message);
    this.status = statusCode;
    this.statusCode = statusCode;
    this.error = error;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, APIError.prototype);

    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 * Used for request validation failures
 */
export class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error
 * Used for authentication failures
 */
export class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error
 * Used for insufficient permissions
 */
export class AuthorizationError extends APIError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error
 * Used when resource is not found
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error
 * Used for resource conflicts (e.g., duplicate entry)
 */
export class ConflictError extends APIError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends APIError {
  constructor(message = 'Internal server error', error = null) {
    super(message, 500, error);
    this.name = 'InternalServerError';
  }
}
