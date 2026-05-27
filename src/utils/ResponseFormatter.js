export const ResponseFormatter = {
  success: (res, statusCode = 200, message, data = null) => {
    return res.status(statusCode).json({
      status: 'ok',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  error: (res, statusCode = 500, message, error = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(process.env.NODE_ENV === 'development' && { error }),
      timestamp: new Date().toISOString(),
    });
  },
  created: (res, message, data) => {
    return res.status(201).json({
      status: 'ok',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  noContent: (res) => {
    return res.status(204).send();
  },
  paginated: (res, data, page, limit, total, message = 'Data retrieved successfully') => {
    return res.status(200).json({
      status: 'ok',
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    });
  },
};
