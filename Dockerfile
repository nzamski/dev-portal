# ── Stage 1: build frontend ────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --prefer-offline
COPY frontend/ ./
RUN npm run build

# ── Stage 2: build backend ─────────────────────────────────────────────────
FROM node:20-alpine AS backend-build
WORKDIR /build
COPY backend/package*.json ./
RUN npm install --prefer-offline
COPY backend/ ./
RUN npm run build

# ── Stage 3: production image ──────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-build /build/dist         ./dist
COPY --from=backend-build /build/node_modules ./node_modules
COPY --from=backend-build /build/package.json  ./
COPY --from=frontend-build /build/dist        ./public
EXPOSE 3000
CMD ["node", "dist/main.js"]
