export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
    return originalJson(data);
  };

  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
    return originalSend(data);
  };

  next();
};
