# Backend API Server

Express.js API server for the BlindInterview platform.

## Overview

This package contains the backend API server built with:

- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Upstash Redis** - Cloud Redis for caching and rate limiting
- **JWT** - Authentication
- **Zod** - Validation (via shared package)
- **fastest-levenshtein** - String similarity matching

## Development

```bash
# From root directory
pnpm dev:backend

# Or from this directory
cd apps/backend
pnpm dev
```

The server will start on `http://localhost:8501` with auto-reload enabled.

## Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── auth.controller.ts      # Authentication endpoints
│   ├── user.controller.ts      # User management
│   ├── order.controller.ts     # Order processing
│   ├── credits.controller.ts   # Credit system
│   ├── apikeys.controller.ts   # API key management
│   ├── pricingTier.controller.ts # Pricing tiers
│   └── webhooks.controller.ts  # Payment webhooks
├── models/            # Database models
│   ├── user.model.ts           # User schema
│   ├── order.model.ts          # Order schema
│   ├── pricing-tier.model.ts   # Pricing schema
│   └── exchange-rate.model.ts  # Exchange rates
├── routes/            # API route definitions
│   ├── auth.route.ts           # Auth routes
│   ├── user.route.ts           # User routes
│   ├── order.route.ts          # Order routes
│   ├── credits.route.ts        # Credits routes
│   ├── apikeys.route.ts        # API keys routes
│   ├── pricing-tier.route.ts   # Pricing routes
│   └── webhooks.route.ts       # Webhook routes
├── services/          # Business logic
│   ├── mail.ts                 # Email service
│   ├── razorpay.ts            # Razorpay integration
│   ├── cashfree.ts            # Cashfree integration
│   ├── exchange-rate.ts       # Currency exchange
│   └── power-parity.ts        # Power parity service
├── middleware/        # Express middleware
│   ├── auth.middleware.ts      # JWT authentication
│   ├── validation.middleware.ts # Request validation
│   ├── error-handler.middleware.ts # Error handling
│   ├── logger.middleware.ts    # Request logging
│   └── security-middleware.ts  # Security headers
├── utils/            # Utility functions
│   ├── api-response.ts         # API response helpers
│   ├── avatar-generator.ts     # Avatar generation
│   ├── catch-async.ts          # Async error wrapper
│   ├── key-management.ts       # API key utilities
│   └── logger.ts               # Winston logger
├── config/           # Configuration files
│   ├── env.ts                  # Environment config
│   └── strategy.ts             # Passport strategies
├── database/         # Database configuration
│   ├── connection.ts           # MongoDB connection
│   └── redis.ts                # Upstash Redis setup
├── constants/        # Application constants
│   ├── error-codes.ts          # Error code definitions
│   └── index.ts                # Exported constants
├── schema/           # Validation schemas
│   └── general.schema.ts       # General schemas
├── mappers/          # Data mappers
│   ├── user.mapper.ts          # User data mapping
│   ├── order.mapper.ts         # Order data mapping
│   └── pricingTier.mapper.ts   # Pricing tier mapping
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

## Key Features

- **Authentication**: JWT-based auth with refresh tokens and Passport.js
- **Payment Processing**: Razorpay and Cashfree integration with webhooks
- **Email Service**: Automated email notifications with templates
- **Rate Limiting**: Redis-based API rate limiting for security
- **Validation**: Request validation using Zod schemas from shared package
- **Error Handling**: Centralized error handling with custom error codes
- **Logging**: Structured logging with Winston and request tracking
- **Caching**: Upstash Redis for caching and session management
- **Currency Support**: Multi-currency with exchange rates and power parity
- **API Key Management**: Secure API key generation and validation
- **Credit System**: User credit management and tracking

## API Routes

### Authentication

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### User Management

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/profile` - Delete user account

### Orders & Credits

- `POST /orders` - Create new order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get specific order
- `POST /credits/purchase` - Purchase credits
- `GET /credits/balance` - Get credit balance

### API Keys

- `POST /apikeys` - Generate new API key
- `GET /apikeys` - List user API keys
- `DELETE /apikeys/:id` - Revoke API key

### Pricing & Tiers

- `GET /pricing-tiers` - Get pricing tiers
- `POST /pricing-tiers` - Create pricing tier (admin)

### Webhooks

- `POST /webhooks/razorpay` - Razorpay payment webhook
- `POST /webhooks/cashfree` - Cashfree payment webhook

## Environment Variables

Create `.env.local` file in this directory for Docker deployment, or `.env` for local development:

```env
# Server Configuration
NODE_ENV=development
PORT=8501
HOST=0.0.0.0

# Database
DATABASE_URL=mongodb://localhost:27017/blindinterview
DB_NAME=blindinterview

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Upstash Redis (Cloud Redis)
UPSTASH_REDIS_URL=redis://your-upstash-url
UPSTASH_REDIS_TOKEN=your-upstash-token

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@blindinterview.com
FROM_NAME=BlindInterview

# Payment Gateways
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_WEBHOOK_SECRET=your-cashfree-webhook-secret

# CORS & Security
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Power Parity (Currency conversion)
POWER_PARITY_API_KEY=your-power-parity-api-key

# API Keys
API_KEY_HEADER=X-API-Key
```

## Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm type-check       # Check TypeScript
```

## Adding New Features

### Creating a New API Endpoint

1. **Define route** in `src/routes/`
2. **Create controller** in `src/controllers/`
3. **Add validation schema** in shared package
4. **Add tests** (if applicable)

Example:

```typescript
// src/routes/example.route.ts
import { Router } from 'express';
import { exampleController } from '../controllers/example.controller';
import { validateSchema } from '../middleware/validation.middleware';
import { exampleSchema } from '@blindinterview/shared';

const router = Router();

router.post('/', validateSchema(exampleSchema), exampleController.create);

export { router as exampleRouter };

// src/controllers/example.controller.ts
import { Request, Response } from 'express';
import { ExampleDTO } from '@blindinterview/shared';

export const exampleController = {
    create: async (req: Request, res: Response) => {
        // Implementation
    },
};
```

### Adding Database Models

```typescript
// src/models/example.model.ts
import { Schema, model } from 'mongoose';

const exampleSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Example = model('Example', exampleSchema);
```

## Dependencies

This package depends on:

- `@blindinterview/shared` - Shared types and utilities
- External packages defined in `package.json`

## Deployment

### Local Development

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Docker

```bash
# From root directory - build and run backend container
pnpm docker:dev:backend

# Or build and run separately
pnpm docker:build:backend
pnpm docker:run:backend

# View logs
pnpm docker:logs:backend
```

**Docker Environment**: Make sure `apps/backend/.env.local` exists before running containers.

**Container URL**: http://localhost:8501

The built code will be in the `dist/` directory.
