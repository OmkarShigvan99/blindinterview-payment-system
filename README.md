# BlindInterview - Monorepo

> AI-powered interview platform built with modern monorepo architecture

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Omishigvan99/blindinterview.git
cd blindinterview

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## 📁 Project Structure

```
blindinterview/
├── apps/
│   ├── backend/           # Express.js API server
│   └── frontend/          # Next.js web application
├── packages/
│   └── shared/           # Shared types, schemas, utilities
├── docs/                 # Documentation
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
└── turbo.json           # Turborepo configuration
```

## 🛠️ Tech Stack

### Core Technologies

- **pnpm workspaces** - Dependency management
- **Turborepo** - Build system and caching
- **TypeScript** - Type safety across all packages

### Backend (`apps/backend`)

- **Express.js** - Web framework
- **MongoDB** - Database
- **Upstash Redis** - Cloud Redis for caching and rate limiting
- **JWT** - Authentication
- **Zod** - Validation

### Frontend (`apps/frontend`)

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives

### Shared (`packages/shared`)

- **TypeScript types** - Common interfaces
- **Zod schemas** - Validation schemas
- **Utilities** - Helper functions

## 🎯 Key Features

✅ **Monorepo Architecture** - Efficient code sharing and dependency management  
✅ **Type Safety** - End-to-end TypeScript with shared types  
✅ **Build Optimization** - Turborepo caching and parallel builds  
✅ **Modern Stack** - Latest versions of Next.js, React, and Node.js  
✅ **Docker Ready** - Containerized deployment with optimized images  
✅ **Cloud Redis** - Upstash Redis for scalable caching and rate limiting  
✅ **Developer Experience** - Hot reload, unified tooling, consistent patterns

## 📋 Available Scripts

### Development

```bash
pnpm dev                 # Start both frontend and backend
pnpm dev:backend         # Start backend only
pnpm dev:frontend        # Start frontend only
```

### Building

```bash
pnpm build              # Build all packages
pnpm build:backend      # Build backend only
pnpm build:frontend     # Build frontend only
```

### Code Quality

```bash
pnpm lint               # Lint all packages
pnpm format             # Format all code
pnpm type-check         # Check TypeScript
pnpm test               # Run tests
```

### Utilities

```bash
pnpm clean              # Clean build artifacts
pnpm reset              # Reset and reinstall everything
```

### Docker Commands

```bash
# Build Docker images
pnpm docker:build       # Build both frontend and backend
pnpm docker:build:backend   # Build backend only
pnpm docker:build:frontend  # Build frontend only

# Run containers
pnpm docker:run:backend     # Run backend container
pnpm docker:run:frontend    # Run frontend container
pnpm docker:dev:backend     # Build and run backend
pnpm docker:dev:frontend    # Build and run frontend

# Management
pnpm docker:stop        # Stop running containers
pnpm docker:clean       # Remove built images
pnpm docker:logs:backend    # View backend logs
pnpm docker:logs:frontend   # View frontend logs

# Docker Compose
pnpm compose:up         # Start all services
pnpm compose:down       # Stop all services
pnpm compose:build      # Build all images
```

## 🏗️ Architecture

### Monorepo Benefits

- **Code Sharing**: Shared types, utilities, and components
- **Consistency**: Unified tooling and standards
- **Efficiency**: Build only what changed
- **Developer Experience**: Single repository, coordinated development

### Package Dependencies

```
apps/backend    ──depends on──> packages/shared
apps/frontend   ──depends on──> packages/shared
```

### Build Pipeline

1. `packages/shared` builds first (no dependencies)
2. `apps/backend` and `apps/frontend` build in parallel (depend on shared)
3. Turborepo handles dependency ordering automatically

## 📚 Documentation

| Document                                     | Description                     |
| -------------------------------------------- | ------------------------------- |
| [Developer Guide](./DEVELOPER_GUIDE.md)      | Comprehensive development guide |
| [Docker Guide](./DOCKER_GUIDE.md)            | Docker setup and deployment     |
| [Quick Reference](./QUICK_REFERENCE.md)      | Common commands and workflows   |
| [Backend README](./apps/backend/README.md)   | Backend-specific documentation  |
| [Frontend README](./apps/frontend/README.md) | Frontend-specific documentation |
| [Shared README](./packages/shared/README.md) | Shared package documentation    |

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (see `.nvmrc`)
- **pnpm 8+** (will be installed automatically)
- **Git**

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Omishigvan99/blindinterview.git
   cd blindinterview
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Backend environment
   cp apps/backend/.env.example apps/backend/.env

   # Frontend environment
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

4. **Start development**

   ```bash
   pnpm dev
   ```

5. **Access applications**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

### Making Your First Change

1. **Frontend changes**: Edit files in `apps/frontend/src/`
2. **Backend changes**: Edit files in `apps/backend/src/`
3. **Shared code**: Edit files in `packages/shared/` (remember to run `pnpm build --filter=@blindinterview/shared`)

## 🔧 Common Workflows

### Adding a New Feature

1. **Plan the feature**: Identify frontend, backend, and shared code needs
2. **Update shared types**: Add types/schemas in `packages/shared/`
3. **Build shared package**: `pnpm build --filter=@blindinterview/shared`
4. **Implement backend**: Add API endpoints in `apps/backend/`
5. **Implement frontend**: Add UI components in `apps/frontend/`
6. **Test**: Ensure everything works together

### Adding Dependencies

```bash
# Backend dependency
pnpm add <package> --filter=@blindinterview/backend

# Frontend dependency
pnpm add <package> --filter=@blindinterview/frontend

# Shared dependency
pnpm add <package> --filter=@blindinterview/shared

# Development tool (affects all packages)
pnpm add -D <package> --workspace-root
```

## 🐛 Troubleshooting

| Issue                                         | Solution                                                           |
| --------------------------------------------- | ------------------------------------------------------------------ |
| "Cannot find module '@blindinterview/shared'" | Build shared package: `pnpm build --filter=@blindinterview/shared` |
| "pnpm: command not found"                     | Install pnpm: `npm install -g pnpm`                                |
| Port already in use                           | Kill process or change port in package.json                        |
| Build cache issues                            | Clear cache: `pnpm turbo clean`                                    |

## 🤝 Contributing

1. **Create a feature branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow the development workflow
3. **Ensure quality**: Run `pnpm lint && pnpm type-check && pnpm build`
4. **Commit**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
5. **Push and create PR**: Submit for review

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

- **Documentation**: Check the guides in the `docs/` folder
- **Issues**: Create an issue on GitHub
- **Questions**: Reach out to the development team

---

**Happy coding! 🎉**
