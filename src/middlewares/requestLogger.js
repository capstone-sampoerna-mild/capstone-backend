/**
 * Request Logging Middleware
 * Logs incoming HTTP requests with method, path, and status information
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Capture the original res.json and res.send methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Override json method
  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
    return originalJson(data);
  };

  // Override send method
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
    return originalSend(data);
  };

  next();
};
