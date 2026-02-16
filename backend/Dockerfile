# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files if using workspaces
COPY package*.json ./
COPY backend/package*.json ./backend/

# Copy shared folder (needed for types)
COPY shared ./shared/

# Install ALL dependencies (including devDependencies)
WORKDIR /app/backend
RUN npm ci && \
    npm cache clean --force

# Copy backend application
COPY backend .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Copy shared folder
COPY shared ./shared/

# Install only production dependencies
WORKDIR /app/backend
RUN npm ci --only=production && \
    npm cache clean --force

# Copy ALL built files from builder
COPY --from=builder /app/backend/build ./build

# Copy drizzle folder for migrations and seeds
COPY backend/drizzle ./drizzle

# Expose the port your app runs on (adjust as needed)
EXPOSE 4000

# Default command to start your app
CMD ["npm", "start"]