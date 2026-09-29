# =============================================================================
# TECHJOB ANALYTICS — FRONTEND DOCKERFILE (KOYEB PRODUCTION)
# =============================================================================
# Multi-stage build: Vite build → Nginx with dynamic backend URL via envsubst
# =============================================================================

# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including build devDependencies like Vite & TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template (uses ${BACKEND_URL} placeholder)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Koyeb uses port 8000 by default, but we configure 8080 for flexibility
EXPOSE 8080

# Default backend URL (overridden by Koyeb env variable)
ENV BACKEND_URL=http://localhost:8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# nginx:alpine image auto-runs envsubst on /etc/nginx/templates/*.template
# and outputs to /etc/nginx/conf.d/ — so BACKEND_URL gets injected automatically
CMD ["nginx", "-g", "daemon off;"]
