# Docker Container Folder Structure

## Stage 1: Builder Stage

### After copying workspace configuration files:

```
/app/
├── package.json                    # Root workspace package.json
├── pnpm-lock.yaml                 # Lockfile for exact versions
├── pnpm-workspace.yaml            # Workspace configuration
├── packages/
│   └── shared/
│       └── package.json           # Shared package metadata only
└── apps/
    └── backend/
        └── package.json           # Backend package metadata only
```

### After `pnpm install --frozen-lockfile`:

```
/app/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/                  # Root node_modules with workspace links
│   ├── @blindinterview/
│   │   ├── backend -> ../apps/backend         # Symlink
│   │   └── shared -> ../packages/shared      # Symlink
│   ├── express/
│   ├── mongoose/
│   └── ... (all dependencies)
├── packages/
│   └── shared/
│       ├── package.json
│       └── node_modules/          # Shared package specific deps
└── apps/
    └── backend/
        ├── package.json
        └── node_modules/          # Backend specific deps
```

### After copying source code:

```
/app/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/
├── packages/
│   └── shared/
│       ├── package.json
│       ├── node_modules/
│       ├── index.ts              # Source files
│       ├── schemas/
│       ├── types/
│       └── utils/
└── apps/
    └── backend/
        ├── package.json
        ├── node_modules/
        ├── src/                  # All backend source code
        │   ├── index.ts
        │   ├── app.ts
        │   ├── config/
        │   ├── controller/
        │   ├── middleware/
        │   ├── model/
        │   ├── route/
        │   ├── service/
        │   └── utils/
        └── tsconfig.json
```

### After building:

```
/app/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/
├── packages/
│   └── shared/
│       ├── package.json
│       ├── node_modules/
│       ├── src/                  # Original TypeScript
│       └── dist/                 # Compiled JavaScript ⭐
│           ├── index.js
│           ├── index.d.ts
│           ├── schemas/
│           ├── types/
│           └── utils/
└── apps/
    └── backend/
        ├── package.json
        ├── node_modules/
        ├── src/                  # Original TypeScript
        └── dist/                 # Compiled JavaScript ⭐
            └── src/
                ├── index.js
                ├── app.js
                ├── config/
                ├── controller/
                ├── middleware/
                ├── model/
                ├── route/
                ├── service/
                └── utils/
```

## Stage 2: Production Stage

### After copying workspace config and installing prod dependencies:

```
/app/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/                  # Only production dependencies
│   ├── @blindinterview/
│   │   ├── backend -> ../apps/backend
│   │   └── shared -> ../packages/shared
│   ├── express/
│   ├── mongoose/
│   └── ... (prod deps only, no dev tools like typescript, eslint)
├── packages/
│   └── shared/
│       └── package.json
└── apps/
    └── backend/
        └── package.json
```

### After copying built artifacts from builder stage:

```
/app/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── node_modules/                  # Production dependencies only
├── packages/
│   └── shared/
│       ├── package.json
│       └── dist/                  # ⭐ Built shared package
│           ├── index.js
│           ├── index.d.ts
│           ├── schemas/
│           ├── types/
│           └── utils/
└── apps/
    └── backend/
        ├── package.json
        └── dist/                  # ⭐ Built backend
            └── src/
                ├── index.js       # 🎯 Entry point
                ├── app.js
                ├── config/
                ├── controller/
                ├── middleware/
                ├── model/
                ├── route/
                ├── service/
                └── utils/
```

## Working Directory and Execution

### Final working directory:

```bash
WORKDIR /app/apps/backend
```

So when the container runs, it's in:

```
/app/apps/backend/    # Current working directory
├── package.json
└── dist/
    └── src/
        └── index.js  # This is what gets executed
```

### Command execution:

```bash
CMD ["node", "-r", "module-alias/register", "dist/src/index.js"]
```

This resolves to: `/app/apps/backend/dist/src/index.js`

## Module Resolution

### How @blindinterview/shared is resolved:

1. Node.js looks for `@blindinterview/shared` in node_modules
2. Finds symlink: `/app/node_modules/@blindinterview/shared -> ../packages/shared`
3. Resolves to: `/app/packages/shared/dist/index.js`

### Module aliases in package.json:

```json
"_moduleAliases": {
  "@src": "dist",           # Maps to /app/apps/backend/dist
  "@shared": "../../packages/shared/dist"  # Maps to /app/packages/shared/dist
}
```

## Docker Commands Reference

### Building Images

```bash
# Build both frontend and backend
pnpm docker:build

# Build individual services
pnpm docker:build:backend     # Build backend image
pnpm docker:build:frontend    # Build frontend image
```

### Running Containers

```bash
# Development workflow (build + run)
pnpm docker:dev:backend       # Build and run backend
pnpm docker:dev:frontend      # Build and run frontend

# Run pre-built images
pnpm docker:run:backend       # Run backend container (port 8501)
pnpm docker:run:frontend      # Run frontend container (port 8500)
```

### Container Management

```bash
# Stop containers
pnpm docker:stop              # Stop all project containers

# View logs
pnpm docker:logs:backend      # View backend container logs
pnpm docker:logs:frontend     # View frontend container logs

# Cleanup
pnpm docker:clean             # Remove project images
pnpm docker:clean:all         # Remove all Docker data (careful!)
```

### Docker Compose

```bash
# Multi-container setup
pnpm compose:up               # Start all services
pnpm compose:down             # Stop all services
pnpm compose:build            # Build all images
pnpm compose:logs             # View all service logs
pnpm compose:restart          # Restart all services
```

### Environment Files

Make sure these environment files exist before running containers:

```bash
# Backend environment
apps/backend/.env.local       # Used by backend container

# Frontend environment
apps/frontend/.env            # Used by frontend container
```

### Service URLs

When running containers:

- **Frontend**: http://localhost:8500
- **Backend**: http://localhost:8501

### Optimization Notes

- **Backend**: Multi-stage build with Alpine Linux (~150MB)
- **Frontend**: Optimized build using pnpm workspace resolution
- **Shared Dependencies**: Efficiently managed through workspace symlinks
- **Production**: Only production dependencies in final images

For development workflow, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
