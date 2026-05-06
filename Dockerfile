# --- Multi-stage build for KSE ---

# Stage 1: Build the Frontend & Backend
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM node:20-slim
WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build.js ./

# Create data directory for persistence
RUN mkdir -p /app/data

# Environment Defaults
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the unified server
CMD ["node", "./dist/server.js"]
