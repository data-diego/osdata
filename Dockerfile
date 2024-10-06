# Stage 1: Building the app
FROM node:20 as build-stage

WORKDIR /app

# Copying package.json and yarn.lock (if available) separately to leverage Docker cache
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN yarn build

# Stage 2: Setting up the production environment
FROM node:20-slim

WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean

# Copy built assets from the build stage
COPY --from=build-stage /app/.output ./.output

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "node", ".output/server/index.mjs" ]
