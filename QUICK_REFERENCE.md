# Quick Reference - BlindInterview Monorepo

## 🚀 Quick Start

```bash
pnpm install          # Install everything
pnpm dev              # Start development
pnpm build            # Build everything
```

## 📁 Key Locations

| What you want to change       | Where to go          | Command                                      |
| ----------------------------- | -------------------- | -------------------------------------------- |
| API endpoints, business logic | `apps/backend/src/`  | `pnpm dev:backend`                           |
| UI, pages, components         | `apps/frontend/src/` | `pnpm dev:frontend`                          |
| Shared types, utilities       | `packages/shared/`   | `pnpm build --filter=@blindinterview/shared` |

## 🔧 Common Commands

### Development

```bash
pnpm dev                    # Start both frontend + backend
pnpm dev:backend           # Backend only (API server)
pnpm dev:frontend          # Frontend only (Next.js)
```

### Building

```bash
pnpm build                 # Build all packages
pnpm build:backend         # Backend only
pnpm build:frontend        # Frontend only
```

### Dependencies

```bash
# Add dependency to specific package
pnpm add <package> --filter=@blindinterview/backend
pnpm add <package> --filter=@blindinterview/frontend
pnpm add <package> --filter=@blindinterview/shared

# Examples
pnpm add axios --filter=@blindinterview/frontend
pnpm add express-rate-limit --filter=@blindinterview/backend
pnpm add zod --filter=@blindinterview/shared
```

### Code Quality

```bash
pnpm lint                  # Lint all packages
pnpm format               # Format all code
pnpm type-check           # Check TypeScript
pnpm test                 # Run tests
```

### Docker Commands

```bash
# Build images
pnpm docker:build         # Build both frontend and backend
pnpm docker:build:backend # Build backend only
pnpm docker:build:frontend # Build frontend only

# Run containers
pnpm docker:dev:backend   # Build and run backend
pnpm docker:dev:frontend  # Build and run frontend
pnpm docker:stop          # Stop all containers
pnpm docker:clean         # Remove images

# Docker Compose
pnpm compose:up           # Start all services
pnpm compose:down         # Stop all services
```

## 🔄 Workflow

### Adding a New API Endpoint

1. **Backend**: Create route in `apps/backend/src/routes/`
2. **Backend**: Add controller in `apps/backend/src/controllers/`
3. **Shared**: Add types/schemas in `packages/shared/`
4. **Frontend**: Use the API in `apps/frontend/src/`

### Adding Shared Types

1. **Create**: Add type in `packages/shared/types/`
2. **Export**: Add to `packages/shared/index.ts`
3. **Build**: Run `pnpm build --filter=@blindinterview/shared`
4. **Use**: Import in frontend/backend with `import { Type } from '@blindinterview/shared'`

### Making Database Changes

1. **Model**: Update model in `apps/backend/src/models/`
2. **Types**: Update types in `packages/shared/types/`
3. **Migration**: Add migration script if needed
4. **API**: Update controllers/routes as needed

## 🐛 Troubleshooting

| Problem                                       | Solution                                           |
| --------------------------------------------- | -------------------------------------------------- |
| "Cannot find module '@blindinterview/shared'" | `pnpm build --filter=@blindinterview/shared`       |
| "pnpm: command not found"                     | `npm install -g pnpm`                              |
| Port already in use                           | Kill process: `lsof -i :3000` then `kill -9 <PID>` |
| TypeScript errors                             | `pnpm type-check` to see all errors                |
| Build cache issues                            | `pnpm turbo clean`                                 |

## 📦 Package Structure

```
apps/
├── backend/           # @blindinterview/backend
└── frontend/          # @blindinterview/frontend

packages/
└── shared/           # @blindinterview/shared
```

## 🔗 Key Files

| File                  | Purpose                |
| --------------------- | ---------------------- |
| `package.json`        | Root workspace config  |
| `pnpm-workspace.yaml` | Workspace definition   |
| `turbo.json`          | Build configuration    |
| `tsconfig.json`       | TypeScript root config |

## 💡 Pro Tips

- Always build shared package after changes: `pnpm build --filter=@blindinterview/shared`
- Use `--filter` to work with specific packages
- Shared package changes require manual rebuild (no hot reload)
- Frontend and backend auto-reload during development
- Use workspace dependencies: `"@blindinterview/shared": "workspace:*"`

## 🚨 Before Committing

```bash
pnpm build            # Ensure everything builds
pnpm lint             # Check linting
pnpm type-check       # Check types
pnpm test             # Run tests
```

---

For detailed information, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) and [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
