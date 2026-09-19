FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

# Compiled application
COPY --from=builder /app/dist ./dist

# Drizzle migration files
COPY --from=builder /app/drizzle ./drizzle

USER node

EXPOSE 5000

CMD ["sh", "-c", "node dist/db/migrate.js && node dist/server.js"]