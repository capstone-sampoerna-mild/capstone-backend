/**
 * API Response Utility
 * Provides standardized response formatting for all endpoints
 */

export const ResponseFormatter = {
  /**
   * Success Response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {string} message - Response message
   * @param {any} data - Response data payload (optional)
   */
  success: (res, statusCode = 200, message, data = null) => {
    return res.status(statusCode).json({
      status: 'ok',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Error Response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {string} message - Error message
   * @param {any} error - Error details (optional)
   */
  error: (res, statusCode = 500, message, error = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(process.env.NODE_ENV === 'development' && { error }),
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Created Response (201)
   * @param {Object} res - Express response object
   * @param {string} message - Response message
   * @param {any} data - Created resource data
   */
  created: (res, message, data) => {
    return res.status(201).json({
      status: 'ok',
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * No Content Response (204)
   * @param {Object} res - Express response object
   */
  noContent: (res) => {
    return res.status(204).send();
  },

  /**
   * Paginated Response
   * @param {Object} res - Express response object
   * @param {any[]} data - Array of items
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @param {number} total - Total number of items
   * @param {string} message - Response message (optional)
   */
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
