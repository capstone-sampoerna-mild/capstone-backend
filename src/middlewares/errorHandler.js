export const errorHandler = (err, req, res, next) => {
  // CHECKPOINT: Stability guard with safe error messaging
  const status = err.status || err.statusCode || 500;
  const isServerError = status >= 500;
  const fallbackMessage = isServerError
    ? 'Terjadi kendala teknis di server. Silakan coba lagi nanti.'
    : 'Permintaan tidak dapat diproses.';
  const message = err.message || fallbackMessage;
  const safeMessage = isServerError
    ? 'Terjadi kendala teknis di server. Silakan coba lagi nanti.'
    : message;

  console.error(`[ERROR] ${status} - ${message}`, err);

  return res.status(status).json({
    status: 'error',
    message: safeMessage,
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan',
    timestamp: new Date().toISOString(),
  });
};
