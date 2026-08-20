FROM node:20-slim AS builder

WORKDIR /app

# Copiar manifiestos e instalar todas las dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente completo
COPY . .

# Deshabilitar telemetría y compilar
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Etapa de ejecución (Producción)
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar archivos compilados y dependencias necesarias
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]