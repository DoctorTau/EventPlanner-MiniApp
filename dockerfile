# Stage 1: Build the Nuxt app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the Nuxt app
RUN npm run build

# Stage 2: Run the app with minimal image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/.output .output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port (Nuxt defaults to 3000)
EXPOSE 3000

# Run the Nuxt app
CMD ["node", ".output/server/index.mjs"]