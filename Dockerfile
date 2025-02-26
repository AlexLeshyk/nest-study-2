FROM node:lts-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:lts-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Build the NestJS app
RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

# Set environment variables for PostgreSQL connection
ENV NODE_ENV=production

EXPOSE 8000

# Command to run the application
CMD ["node", "dist/main.js"]
