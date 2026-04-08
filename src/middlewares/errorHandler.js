/**
 * Global Error Handling Middleware
 * Catches all errors and returns a standardized error response
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${status} - ${message}`, err);

  return res.status(status).json({
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 404 Not Found Middleware
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
};
