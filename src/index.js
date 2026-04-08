import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/environment.js';
import { swaggerSpec } from './config/swagger.js';
import { corsMiddleware } from './middlewares/cors.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

/**
 * Security Middleware
 * Helmet helps secure Express apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * CORS Middleware
 * Enable Cross-Origin Resource Sharing
 */
app.use(corsMiddleware);

/**
 * Request Parsing Middleware
 * Parses incoming request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests
 */
app.use(requestLogger);

/**
 * API Documentation
 * Swagger UI for API documentation and testing
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes
 * All API routes prefixed with /api
 */
app.use('/api', apiRoutes);

/**
 * Global Error Handling
 * 404 handler for non-existent routes
 */
app.use(notFoundHandler);

/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 */
app.use(errorHandler);

/**
 * Server Initialization
 * Start the Express server on the configured port
 */
const server = app.listen(config.port, () => {
  console.log(`\n🚀 Server running on http://localhost:${config.port}`);
  console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📦 API Version: ${config.apiVersion}\n`);
});

/**
 * Graceful Shutdown
 * Handle server termination signals
 */
process.on('SIGTERM', () => {
  console.log('\n📍 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📍 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

export default app;
