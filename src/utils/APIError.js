export class APIError extends Error {
  constructor(message, statusCode = 500, error = null) {
    super(message);
    this.status = statusCode;
    this.statusCode = statusCode;
    this.error = error;

    Object.setPrototypeOf(this, APIError.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends APIError {
  constructor(message = 'Internal server error', error = null) {
    super(message, 500, error);
    this.name = 'InternalServerError';
  }
}
