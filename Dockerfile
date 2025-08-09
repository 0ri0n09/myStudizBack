FROM node:20-alpine3.18 as base
# All deps stage
FROM base as deps
WORKDIR /app/backend
ADD package.json package-lock.json ./
RUN npm ci --force

# Build stage
FROM deps as build
WORKDIR /app/backend
COPY . .
RUN node ace build --ignore-ts-errors

# Production stage
FROM base
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules /app/backend/node_modules
COPY --from=build /app/backend/build /app/backend

# Expose the port the app runs on
EXPOSE 3333

# Command to run the application
CMD ["sh", "-c", "node ace migration:fresh && node ace db:seed && node ./bin/server.js"]
