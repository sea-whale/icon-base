FROM node:20-alpine AS builder

# Enable corepack for pnpm (reads version from packageManager in package.json)
RUN corepack enable

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Nuxt application
RUN pnpm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/.output /app/.output

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the Nuxt server
CMD ["node", ".output/server/index.mjs"]
