# Career Pathing & Skills Gap Analyzer - API Gateway

Professional Express.js boilerplate for the **AI-Driven Career Pathing & Skills Gap Analyzer** capstone project.

## 📋 Overview

This API Gateway serves as the central entry point for the capstone system, orchestrating communication between the frontend, backend services, and machine learning models. Built with industry best practices adhering to the Capstone SDLC standards.

## 🏗️ Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── environment.js        # Environment configuration
│   │   └── swagger.js            # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── healthController.js   # Business logic for health checks
│   ├── middlewares/
│   │   ├── cors.js               # CORS configuration
│   │   ├── errorHandler.js       # Global error handling
│   │   └── requestLogger.js      # Request logging middleware
│   ├── routes/
│   │   ├── index.js              # Main routes router
│   │   └── v1/
│   │       ├── index.js          # API v1 router
│   │       └── healthRoutes.js   # Health check routes
│   └── index.js                  # Express server entry point
├── .env                          # Local environment variables (do not commit)
├── .env.example                  # Environment template (commit this)
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   export PORT=5000
   export NODE_ENV=development
   export CORS_ORIGIN=http://localhost:3000
   ```

3. **Start the Development Server**

   ```bash
   # Using npm (with auto-reload via nodemon)
   npm run dev

   # Or production mode
   npm start
   ```

### Quick Test

```bash
# Health check endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
{
  "status": "ok",
  "message": "Server is running and healthy",
  "timestamp": "2024-04-08T10:30:00Z",
  "version": "v1",
  "uptime": 1234.5,
  "environment": "development"
}
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI JSON**: http://localhost:5000/api-docs.json

## 🔐 Security Features

### Helmet.js

- Sets security-related HTTP headers
- Protects against common vulnerabilities (XSS, CSRF, etc.)

### CORS (Cross-Origin Resource Sharing)

- Configurable origin whitelist
- Credential support for authenticated requests
- Preflight request handling

### Environment Variables

- Sensitive configuration managed via `.env`
- `.env.example` for safe sharing (credentials not included)

### Error Handling

- Centralized error middleware
- Standardized error response format
- Request validation support

## 📦 API Endpoints

### Health Check

```
GET /api/v1/health
```

Verifies server health status and operational details.

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running and healthy",
  "timestamp": "2024-04-08T10:30:00Z",
  "version": "v1",
  "uptime": 1234.5,
  "environment": "development"
}
```

## 🔧 NPM Scripts

| Command       | Description                               |
| ------------- | ----------------------------------------- |
| `npm start`   | Run server in production mode             |
| `npm run dev` | Run server with auto-reload (development) |
| `npm test`    | Run test suite (to be configured)         |

## 📋 Middleware Stack

1. **Helmet** - Security headers
2. **CORS** - Cross-origin requests
3. **Express.json** - JSON body parsing (10MB limit)
4. **Express.urlencoded** - URL-encoded body parsing
5. **Request Logger** - HTTP request logging
6. **Swagger UI** - API documentation
7. **Error Handler** - Global error handling
8. **404 Handler** - Route not found handling

## 🛠️ Adding New Routes

### 1. Create a Controller

```javascript
// src/controllers/exampleController.js
export const exampleEndpoint = (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Example response",
  });
};
```

### 2. Create a Route File

```javascript
// src/routes/v1/exampleRoutes.js
import express from "express";
import { exampleEndpoint } from "../../controllers/exampleController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/example:
 *   get:
 *     summary: Example Endpoint
 *     tags:
 *       - Example
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/example", exampleEndpoint);

export default router;
```

### 3. Register the Route

```javascript
// src/routes/v1/index.js
import exampleRoutes from "./exampleRoutes.js";

router.use("/", exampleRoutes);
```

## 🔄 Integration Points

### Frontend Connection

- WebSocket support ready for real-time features
- RESTful API endpoints for data operations
- CORS configured for frontend domain

### Backend Services

- FastAPI model serving integration ready
- Streamlit dashboard communication support
- Data Science pipeline connectors

### Database Integration

Template for database connections (coming in next phase):

```javascript
// src/config/database.js (to be created)
// MongoDB, PostgreSQL configurations
```

## 📝 API Response Format

### Success Response

```json
{
  "status": "ok",
  "data": {},
  "message": "Request successful",
  "timestamp": "2024-04-08T10:30:00Z"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2024-04-08T10:30:00Z"
}
```

## ⚙️ Environment Variables Reference

| Variable      | Default               | Description                          |
| ------------- | --------------------- | ------------------------------------ |
| `PORT`        | 5000                  | Server port                          |
| `NODE_ENV`    | development           | Environment (development/production) |
| `API_VERSION` | v1                    | API version prefix                   |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed CORS origin                  |
| `LOG_LEVEL`   | info                  | Logging level                        |

## 🚦 RESTful API Conventions

This gateway follows RESTful API best practices:

- **HTTP Methods**: GET (retrieve), POST (create), PUT (update), DELETE (remove), PATCH (partial update)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
- **Naming**: Lowercase, hyphenated paths (e.g., `/api/v1/skill-gaps`)
- **Versioning**: URL-based versioning (`/api/v1`, `/api/v2`, etc.)
- **Request/Response**: JSON with consistent structure

## 📦 Dependencies

### Production

- **express**: Web framework
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **swagger-jsdoc**: Swagger/OpenAPI specification generator
- **swagger-ui-express**: Swagger UI middleware

### Development

- **nodemon**: Auto-reload server during development

## 🔐 Security Checklist

- [ ] `.env` file excluded from version control
- [ ] `helmet()` middleware enabled
- [ ] CORS origin restricted to known domains
- [ ] Input validation implemented (coming in phase 2)
- [ ] Rate limiting configured (optional)
- [ ] Logging configured for audit trails

## 🤝 Contributing

Follow the Capstone SDLC standards:

1. Create feature branches from `main`
2. Implement features following the modular structure
3. Add comprehensive JSDoc comments
4. Update Swagger documentation for new endpoints
5. Submit for peer review before merging

## 📄 License

ISC License - Coding Camp Capstone Project 2024

## 👥 Support

For issues or questions, contact the Capstone Technical Lead.

---

**Last Updated**: April 8, 2024  
**API Gateway Version**: 1.0.0  
**Node.js Requirement**: v16+
# capstone-backend
