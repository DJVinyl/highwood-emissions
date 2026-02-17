# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files if using workspaces
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/packages*.json ./shared/

# Copy shared folder (needed for types)
COPY shared ./shared/

WORKDIR /app/shared
RUN npm ci && \
    npm run build && \
    npm cache clean --force

# Install ALL dependencies (including devDependencies)
WORKDIR /app/backend
RUN npm ci && \
    npm cache clean --force

# Copy backend application
COPY backend .

RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Copy shared folder
COPY --from=builder /app/shared/build ./shared/build
COPY shared/package.json ./shared/

WORKDIR /app/shared
RUN npm ci --only=production && \
    npm cache clean --force

# Install only production dependencies
WORKDIR /app/backend
RUN npm ci --only=production && \
    npm cache clean --force

# Copy ALL built files from builder
COPY --from=builder /app/backend/build ./build

# Copy drizzle folder for migrations and seeds
COPY backend/drizzle ./drizzle

COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose the port your app runs on (adjust as needed)
EXPOSE 4000

# Default command to start your app
CMD ["npm", "start"]