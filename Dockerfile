FROM node:20.18.3-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the NestJS app
RUN npm run build

FROM node:20.18.3-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --only=production

EXPOSE 8000

# Set environment variables for PostgreSQL connection
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/main.js"]
