# BlindInterview Monorepo - Developer Guide

This comprehensive guide will teach you everything you need to know about working with the BlindInterview monorepo.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Working with Packages](#working-with-packages)
6. [Development Workflow](#development-workflow)
7. [Adding Dependencies](#adding-dependencies)
8. [Sharing Code](#sharing-code)
9. [Build System](#build-system)
10. [Common Tasks](#common-tasks)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

## Overview

This is a **monorepo** - a single repository containing multiple related packages. Our monorepo uses:

- **pnpm workspaces** for dependency management
- **Turborepo** for build orchestration and caching
- **TypeScript** for type safety across all packages

### Why a Monorepo?

✅ **Code Sharing**: Share types, utilities, and components between frontend and backend  
✅ **Consistency**: Unified tooling, dependencies, and standards  
✅ **Efficiency**: Build only what changed, share dependencies  
✅ **Developer Experience**: Single setup, coordinated releases

## Tech Stack

### Core Technologies

- **pnpm workspaces** - Dependency management and monorepo coordination
- **Turborepo** - Build system with smart caching and parallel execution
- **TypeScript** - Type safety across all packages
- **Docker** - Containerized development and deployment

### Backend (`apps/backend`)

- **Express.js 5** - Web framework for API server
- **MongoDB** - NoSQL database for data persistence
- **Upstash Redis** - Cloud Redis for caching and rate limiting
- **JWT** - Authentication and session management
- **Zod** - Runtime validation and type checking
- **fastest-levenshtein** - String similarity matching for fuzzy search

### Frontend (`apps/frontend`)

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form state management
- **Framer Motion** - Animation library

### Shared (`packages/shared`)

- **TypeScript** - Common type definitions
- **Zod** - Shared validation schemas
- **Utility Functions** - Helper functions for both frontend and backend

### Development Tools

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Turbo** - Build orchestration
- **Docker Compose** - Multi-container development environment

## Getting Started

### Prerequisites

```bash
# Required software
Node.js 18+        # See .nvmrc for exact version
pnpm 8+           # Package manager
Git               # Version control
```

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Omishigvan99/blindinterview.git
cd blindinterview

# Install all dependencies (this may take a few minutes first time)
pnpm install

# Verify setup by building everything
pnpm build

# Start development
pnpm dev
```

## Project Structure

```
blindinterview/
├── apps/                          # Applications
│   ├── backend/                   # Express.js API server
│   │   ├── src/                   # Source code
│   │   │   ├── controllers/       # Route handlers
│   │   │   ├── models/           # Database models
│   │   │   ├── routes/           # API routes
│   │   │   ├── services/         # Business logic
│   │   │   ├── middleware/       # Express middleware
│   │   │   └── utils/            # Backend utilities
│   │   ├── package.json          # Backend dependencies
│   │   ├── tsconfig.json         # TypeScript config
│   │   └── Dockerfile            # Container config
│   │
│   └── frontend/                  # Next.js web application
│       ├── src/                   # Source code
│       │   ├── app/              # Next.js app router
│       │   ├── components/       # React components
│       │   ├── hooks/            # Custom React hooks
│       │   ├── utils/            # Frontend utilities
│       │   └── types/            # Frontend-specific types
│       ├── public/               # Static assets
│       ├── package.json          # Frontend dependencies
│       └── next.config.ts        # Next.js configuration
│
├── packages/                      # Shared packages
│   └── shared/                   # Common code shared between apps
│       ├── schemas/              # Zod validation schemas
│       ├── types/                # TypeScript type definitions
│       ├── utils/                # Shared utility functions
│       ├── index.ts              # Main export file
│       ├── package.json          # Shared package config
│       └── tsconfig.json         # TypeScript config
│
├── package.json                   # Root package.json (workspace config)
├── pnpm-workspace.yaml           # pnpm workspace definition
├── turbo.json                    # Turborepo configuration
├── tsconfig.json                 # Root TypeScript config
├── .prettierrc                   # Code formatting rules
├── .gitignore                    # Git ignore patterns
└── .nvmrc                        # Node.js version specification
```

### Package Naming Convention

All packages use scoped names:

- `@blindinterview/backend` - Backend API server
- `@blindinterview/frontend` - Frontend web application
- `@blindinterview/shared` - Shared utilities and types

## Working with Packages

### Understanding Workspaces

Each folder in `apps/` and `packages/` is a **workspace** (or package). Each workspace:

- Has its own `package.json`
- Can have its own dependencies
- Can depend on other workspaces
- Has its own build process

### Package Dependencies

```json
// In apps/backend/package.json
{
  "dependencies": {
    "@blindinterview/shared": "workspace:*", // Uses local shared package
    "express": "^5.1.0" // External dependency
  }
}
```

The `workspace:*` protocol tells pnpm to use the local version of the shared package.

## Development Workflow

### Starting Development

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications
pnpm dev:backend      # Only backend API server
pnpm dev:frontend     # Only frontend Next.js app
```

### Making Changes

#### 1. Backend Changes (API, Database, Business Logic)

**Location**: `apps/backend/src/`

```bash
# Navigate to backend
cd apps/backend

# Start backend in development mode (with auto-reload)
pnpm dev

# The server will automatically restart when you make changes
```

**Common backend tasks**:

- Add new API endpoints in `src/routes/`
- Create new controllers in `src/controllers/`
- Add database models in `src/models/`
- Write business logic in `src/services/`

#### 2. Frontend Changes (UI, Components, Pages)

**Location**: `apps/frontend/src/`

```bash
# Navigate to frontend
cd apps/frontend

# Start frontend in development mode (with hot reload)
pnpm dev

# Frontend will automatically refresh when you make changes
```

**Common frontend tasks**:

- Add new pages in `src/app/`
- Create components in `src/components/`
- Add custom hooks in `src/hooks/`
- Style with CSS in component files

#### 3. Shared Code Changes (Types, Utils, Schemas)

**Location**: `packages/shared/`

```bash
# Navigate to shared package
cd packages/shared

# Build the shared package after making changes
pnpm build

# Both frontend and backend will use the updated shared code
```

**Common shared tasks**:

- Add new types in `types/`
- Create validation schemas in `schemas/`
- Add utility functions in `utils/`
- Export new items from `index.ts`

### Hot Reloading Behavior

- **Frontend**: Instant hot reload in browser
- **Backend**: Automatic server restart on file changes
- **Shared**: Manual rebuild required (`pnpm build` in shared package)

## Adding Dependencies

### External Dependencies

```bash
# Add dependency to specific package
pnpm add <package> --filter=<workspace-name>

# Examples:
pnpm add lodash --filter=@blindinterview/backend
pnpm add react-query --filter=@blindinterview/frontend
pnpm add zod --filter=@blindinterview/shared

# Add dev dependency
pnpm add -D @types/node --filter=@blindinterview/backend
```

### Workspace Dependencies

To use one workspace in another:

```bash
# Add shared package to backend
pnpm add @blindinterview/shared --filter=@blindinterview/backend

# This automatically uses workspace:* protocol
```

### Root Dependencies (Tools, Global Configs)

```bash
# Add to root (affects all workspaces)
pnpm add -D eslint prettier typescript --workspace-root
```

## Sharing Code

### Creating Shared Types

```typescript
// packages/shared/types/user.ts
export interface UserDTO {
  id: string;
  email: string;
  name: string;
}

// packages/shared/index.ts
export * from './types/user';
```

### Using Shared Code

```typescript
// In backend: apps/backend/src/controllers/user.controller.ts
import { UserDTO } from '@blindinterview/shared';

export const getUser = async (req, res): Promise<UserDTO> => {
  // Implementation
};

// In frontend: apps/frontend/src/components/UserProfile.tsx
import { UserDTO } from '@blindinterview/shared';

interface Props {
  user: UserDTO;
}
```

### Shared Validation Schemas

```typescript
// packages/shared/schemas/user.schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
```

## Build System

### Understanding Turborepo

Turborepo orchestrates builds across packages and provides:

- **Dependency ordering**: Builds shared packages before apps
- **Caching**: Skips rebuilding unchanged packages
- **Parallelization**: Builds independent packages simultaneously

### Build Commands

```bash
# Build everything (respects dependencies)
pnpm build

# Build specific package
pnpm build --filter=@blindinterview/shared
pnpm build --filter=@blindinterview/backend

# Force rebuild (ignore cache)
pnpm build --force
```

### Build Order

1. `@blindinterview/shared` (no dependencies)
2. `@blindinterview/backend` (depends on shared)
3. `@blindinterview/frontend` (depends on shared)

## Common Tasks

### Development

```bash
# Start everything
pnpm dev

# Start specific apps
pnpm dev:backend
pnpm dev:frontend

# Check types across all packages
pnpm type-check
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format all code
pnpm format

# Run tests
pnpm test
```

### Dependency Management

```bash
# Install new dependencies
pnpm install

# Update dependencies
pnpm update

# Remove dependency
pnpm remove <package> --filter=<workspace>

# Check for security issues
pnpm audit
```

### Building & Deployment

```bash
# Production build
pnpm build

# Clean build artifacts
pnpm clean

# Reset everything (nuclear option)
pnpm reset
```

### Docker Development

#### Building Docker Images

```bash
# Build both frontend and backend
pnpm docker:build

# Build individual services
pnpm docker:build:backend
pnpm docker:build:frontend
```

#### Running Containers

```bash
# Quick development setup
pnpm docker:dev:backend     # Build and run backend
pnpm docker:dev:frontend    # Build and run frontend

# Manual container management
pnpm docker:run:backend     # Run pre-built backend
pnpm docker:run:frontend    # Run pre-built frontend
```

#### Container Management

```bash
# Stop all running containers
pnpm docker:stop

# View container logs
pnpm docker:logs:backend
pnpm docker:logs:frontend

# Clean up images
pnpm docker:clean           # Remove project images
pnpm docker:clean:all       # Remove all Docker data (careful!)
```

#### Docker Compose

```bash
# Start all services together
pnpm compose:up

# Stop all services
pnpm compose:down

# Build and start
pnpm compose:build
pnpm compose:up

# View logs
pnpm compose:logs
```

#### Environment Variables for Docker

Make sure to set up environment files:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env.local

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

Docker containers use:

- Backend: `apps/backend/.env.local`
- Frontend: `apps/frontend/.env`

### Working with Git

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push changes
git push origin feature/new-feature
```

## Troubleshooting

### Common Issues

#### "Cannot find module '@blindinterview/shared'"

**Solution**: Build the shared package first

```bash
cd packages/shared
pnpm build
```

#### "pnpm: command not found"

**Solution**: Install pnpm globally

```bash
npm install -g pnpm
```

#### Build fails with TypeScript errors

**Solution**: Check tsconfig.json paths and references

```bash
# Verify TypeScript configuration
pnpm type-check

# Rebuild shared package
pnpm build --filter=@blindinterview/shared
```

#### Port already in use

**Solution**: Kill existing processes

```bash
# Find process using port
lsof -i :3000  # or :8000 for backend

# Kill process
kill -9 <PID>
```

#### Cache issues

**Solution**: Clear Turborepo cache

```bash
pnpm turbo clean
```

### Debug Mode

```bash
# Run with verbose logging
pnpm dev --verbose

# Debug Turborepo
pnpm build --dry-run
```

## Best Practices

### Project Organization

1. **Keep shared code minimal**: Only add truly shared utilities and types
2. **Organize by feature**: Group related files together
3. **Use descriptive names**: Clear file and function names
4. **Export explicitly**: Always export from index files

### Code Sharing

```typescript
// ✅ Good: Specific, focused shared types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ❌ Bad: Overly specific to one app
export interface UserProfileFormState {
  // This should stay in frontend
}
```

### Dependencies

1. **Add dependencies to the right package**: Don't add React to backend
2. **Use workspace dependencies**: Reference other packages with `workspace:*`
3. **Keep root dependencies minimal**: Only tools used by all packages

### Development

1. **Build shared first**: Always build shared package after changes
2. **Use TypeScript**: Leverage type checking across packages
3. **Test in isolation**: Each package should be testable independently
4. **Follow naming conventions**: Use consistent file and folder naming

### Git Workflow

1. **Create feature branches**: Don't work directly on main
2. **Use conventional commits**: Follow commit message conventions
3. **Test before pushing**: Ensure builds work locally
4. **Small, focused changes**: Keep pull requests manageable

## Advanced Usage

### Adding New Packages

```bash
# Create new package directory
mkdir packages/ui

# Create package.json
cd packages/ui
pnpm init

# Update package name
{
  "name": "@blindinterview/ui",
  "private": true
}

# Add to workspace (automatic with our pnpm-workspace.yaml pattern)
```

### Custom Turborepo Tasks

```json
// turbo.json
{
  "tasks": {
    "custom-task": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Environment Variables

```bash
# Root .env (shared)
DATABASE_URL=...

# Package-specific .env
# apps/backend/.env.local
API_SECRET=...

# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=...
```

This guide should give you everything you need to work effectively with the BlindInterview monorepo. For more specific questions, refer to the individual package documentation or reach out to the team!
