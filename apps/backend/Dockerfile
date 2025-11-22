# stage 1: Build stage
FROM node:lts-alpine3.22 AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages and apps package.json files
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Build shared package first
RUN pnpm --filter @blindinterview/shared build

# Build backend
RUN pnpm --filter @blindinterview/backend build

# stage 2: Production stage
FROM node:lts-alpine3.22

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Create nodejs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages and apps package.json files
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built shared package
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/package.json ./packages/shared/

# Copy built backend
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/dist ./apps/backend/dist

# Change ownership of the entire app directory
RUN chown -R nodejs:nodejs /app

ENV NODE_ENV=production
ENV SERVER_PORT=8080
EXPOSE 8080

USER nodejs

WORKDIR /app/apps/backend

CMD ["node", "-r", "module-alias/register", "dist/src/index.js"]
