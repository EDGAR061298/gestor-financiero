# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# 3. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Argumento temporal para que no falle la conexión en tiempo de compilación estática
ENV MONGODB_URI="mongodb+srv://admin_db:proyecto2026@cluster0.bddhrod.mongodb.net/gestor_financiero?retryWrites=true&w=majority&appName=Cluster0"

RUN npm run build

# 4. Runner stage (Producción)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copiar artefactos standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]