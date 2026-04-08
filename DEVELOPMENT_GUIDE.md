# API Gateway Development Guide

This guide provides comprehensive instructions for extending and maintaining the Express.js API Gateway for the capstone project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Adding New Endpoints](#adding-new-endpoints)
3. [Error Handling](#error-handling)
4. [Request/Response Patterns](#requestresponse-patterns)
5. [Middleware Usage](#middleware-usage)
6. [Integration with AI Services](#integration-with-ai-services)
7. [Testing Endpoints](#testing-endpoints)
8. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

### Folder Structure Philosophy

```
src/
├── config/          → Application configuration & startup
├── controllers/     → Business logic for each route
├── middlewares/     → Request/response processing
├── routes/          → API endpoint definitions
├── constants/       → App-wide constants
├── utils/           → Utility functions & formatters
└── schemas/         → API schema definitions
```

### Data Flow

```
Request
  ↓
CORS Middleware
  ↓
Helmet Security Headers
  ↓
Request Logger
  ↓
Body Parser (JSON/URL-encoded)
  ↓
Route Handler
  ↓
Controller (Business Logic)
  ↓
Response Formatter
  ↓
Error Handler (if error)
  ↓
Response sent to Client
```

---

## Adding New Endpoints

### Step 1: Create a Controller

**File**: `src/controllers/skillsController.js`

```javascript
import { ResponseFormatter } from "../utils/ResponseFormatter.js";
import { ValidationError, NotFoundError } from "../utils/APIError.js";

/**
 * Get all skills
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllSkills = async (req, res, next) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Mock data (replace with actual database query)
    const skills = [
      { id: 1, name: "Python", category: "Programming" },
      { id: 2, name: "JavaScript", category: "Programming" },
    ];

    return ResponseFormatter.paginated(
      res,
      skills,
      page,
      limit,
      skills.length,
      "Skills retrieved successfully",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get skill by ID
 */
export const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Skill ID is required");
    }

    // Mock data
    const skill = { id, name: "Python", category: "Programming" };

    if (!skill) {
      throw new NotFoundError("Skill");
    }

    return ResponseFormatter.success(
      res,
      200,
      "Skill retrieved successfully",
      skill,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new skill
 */
export const createSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      throw new ValidationError("Name and category are required");
    }

    const newSkill = { id: 3, name, category };

    return ResponseFormatter.created(
      res,
      "Skill created successfully",
      newSkill,
    );
  } catch (error) {
    next(error);
  }
};
```

### Step 2: Create Routes

**File**: `src/routes/v1/skillsRoutes.js`

```javascript
import express from "express";
import {
  getAllSkills,
  getSkillById,
  createSkill,
} from "../../controllers/skillsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/skills:
 *   get:
 *     summary: Get all skills
 *     description: Retrieve a paginated list of available skills
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ['ok']
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get("/skills", getAllSkills);

/**
 * @swagger
 * /api/v1/skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill details
 *       404:
 *         description: Skill not found
 */
router.get("/skills/:id", getSkillById);

/**
 * @swagger
 * /api/v1/skills:
 *   post:
 *     summary: Create a new skill
 *     tags:
 *       - Skills
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created
 *       400:
 *         description: Validation error
 */
router.post("/skills", createSkill);

export default router;
```

### Step 3: Register Routes

**Update**: `src/routes/v1/index.js`

```javascript
import express from "express";
import healthRoutes from "./healthRoutes.js";
import skillsRoutes from "./skillsRoutes.js";

const router = express.Router();

router.use("/", healthRoutes);
router.use("/", skillsRoutes);

export default router;
```

---

## Error Handling

### Using Custom Error Classes

```javascript
import { ValidationError, NotFoundError, APIError } from "../utils/APIError.js";

// Validation Error
throw new ValidationError("Invalid email format");

// Not Found Error
throw new NotFoundError("User");

// Generic API Error
throw new APIError("Custom error message", 400, errorDetails);

// Authorization Error
import { AuthorizationError } from "../utils/APIError.js";
throw new AuthorizationError(
  "You do not have permission to access this resource",
);
```

### Error Handling in Controllers

```javascript
export const exampleController = async (req, res, next) => {
  try {
    // Your logic here
    if (!req.body.id) {
      throw new ValidationError("ID is required");
    }
  } catch (error) {
    // Pass to error middleware
    next(error);
  }
};
```

---

## Request/Response Patterns

### Standard Success Response

```json
{
  "status": "ok",
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "Python"
  },
  "timestamp": "2024-04-08T10:30:00Z"
}
```

### Standard Error Response

```json
{
  "status": "error",
  "message": "Validation failed",
  "timestamp": "2024-04-08T10:30:00Z"
}
```

### Paginated Response

```json
{
  "status": "ok",
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "timestamp": "2024-04-08T10:30:00Z"
}
```

---

## Middleware Usage

### Creating Custom Middleware

```javascript
// src/middlewares/authentication.js
export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No authorization token provided",
    });
  }

  // Validate token logic here
  next();
};
```

### Applying Middleware to Routes

```javascript
import { authenticateToken } from "../../middlewares/authentication.js";

router.post("/skills", authenticateToken, createSkill);
```

---

## Integration with AI Services

### Calling FastAPI Model Server

```javascript
import fetch from "node-fetch";

export const predictJobReadiness = async (req, res, next) => {
  try {
    const { userProfile } = req.body;

    // Call FastAPI model endpoint
    const response = await fetch("http://localhost:8000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userProfile),
    });

    const prediction = await response.json();

    return ResponseFormatter.success(
      res,
      200,
      "Prediction completed",
      prediction,
    );
  } catch (error) {
    next(error);
  }
};
```

### Streaming Data from Streamlit Dashboard

```javascript
// Example: Proxying Streamlit metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const response = await fetch("http://localhost:8501/api/metrics");
    const metrics = await response.json();

    return ResponseFormatter.success(res, 200, "Metrics retrieved", metrics);
  } catch (error) {
    next(error);
  }
};
```

---

## Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Get all skills
curl http://localhost:5000/api/v1/skills?page=1&limit=20

# Get skill by ID
curl http://localhost:5000/api/v1/skills/1

# Create skill
curl -X POST http://localhost:5000/api/v1/skills \
  -H "Content-Type: application/json" \
  -d '{"name":"React","category":"Frontend"}'
```

### Using Swagger UI

1. Start the server: `npm run dev`
2. Navigate to: http://localhost:5000/api-docs
3. Try endpoints directly from the UI

### Using Postman/Insomnia

1. Import API documentation from Swagger JSON
2. Create requests in the collection
3. Test with different payloads

---

## Performance Optimization

### Request Body Limits

```javascript
// In src/index.js
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
```

### Caching Strategies

```javascript
// Simple in-memory cache middleware
const cache = new Map();

export const cacheMiddleware = (req, res, next) => {
  if (req.method === "GET") {
    const cachedResponse = cache.get(req.originalUrl);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
  }
  next();
};
```

### Database Connection Pooling

(To be implemented in Phase 2)

```javascript
// src/config/database.js
import Pool from "pg";

export const pool = new Pool({
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});
```

---

## Best Practices

✅ **DO:**

- Use descriptive variable and function names
- Add JSDoc comments to all functions
- Use error middleware for centralized error handling
- Validate user input before processing
- Log important operations
- Use environment variables for configuration

❌ **DON'T:**

- Hardcode secrets or API keys
- Leave console.log statements in production code
- Ignore error handling
- Mix business logic with route handlers
- Use synchronous operations for I/O

---

## Questions?

Contact the Capstone Technical Lead or refer to the main README.md for additional information.
