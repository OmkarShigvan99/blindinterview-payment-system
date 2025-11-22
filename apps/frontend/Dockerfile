# Build stage
FROM node:lts-alpine3.22 AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for dependency installation
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm run build

# Build frontend with standalone output
WORKDIR /app/apps/frontend

# Accept build-time variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL
ARG NEXT_PUBLIC_MACOS_DOWNLOAD_URL

# Set them as environment vars during build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL=$NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL
ENV NEXT_PUBLIC_MACOS_DOWNLOAD_URL=$NEXT_PUBLIC_MACOS_DOWNLOAD_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Production stage - Hybrid approach for reliability
FROM node:lts-alpine3.22 AS runner

# Install pnpm for fallback
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy workspace configuration for pnpm fallback
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./

# Copy built shared package (needed for workspace resolution)
COPY --from=builder --chown=nextjs:nodejs /app/packages/shared ./packages/shared

# Copy the complete frontend app (including .next directory)
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend ./apps/frontend

# Install only production dependencies (lightweight)
RUN pnpm install --frozen-lockfile --prod --filter=@blindinterview/frontend...

USER nextjs

ENV PORT=8080
EXPOSE 8080

WORKDIR /app/apps/frontend

# Use pnpm start which works reliably with workspace setup
CMD ["pnpm", "start"]
