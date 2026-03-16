# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo archivos de dependencias primero (cache por capas)
COPY package.json yarn.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY tsconfig.base.json ./

# Instalar todas las dependencias
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Compilar en orden: shared → api → web
RUN yarn workspace @ecommerce/shared build
RUN yarn workspace api build
RUN yarn workspace web build


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario para instalar dependencias de producción
COPY package.json yarn.lock ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/

# Solo dependencias de producción → imagen mucho más liviana
RUN yarn install --production --frozen-lockfile

# Copiar los builds compilados desde el builder
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/web/dist apps/web/dist

# Variable para que Express encuentre el build de React
ENV WEB_DIST_PATH=/app/apps/web/dist
ENV NODE_ENV=production
ENV PORT=10000

# Variables de base de datos (reemplaza con tus valores reales)
# ENV DATABASE_URL="postgresql://usuario:password@host:5432/database"

EXPOSE 10000

CMD ["node", "apps/api/dist/server.js"]
