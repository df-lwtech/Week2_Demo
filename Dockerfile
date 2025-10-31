# Single-stage production Dockerfile (builds client then prunes dev deps)
FROM node:20-alpine

WORKDIR /app

# Install build tools needed during the build (node-gyp, etc.)
RUN apk add --no-cache python3 make g++ bash

# Copy package manifests for server and client to leverage cache
COPY package.json package-lock.json* ./
COPY client/package.json client/package-lock.json* ./client/

# Install full dependencies (including dev deps) so we can build the client
RUN npm install

# Copy the rest of the project and build the client
COPY . .
# Install client dependencies (build tools like Vite live in client devDeps)
RUN cd client && npm install
RUN npm run client:build

# Remove development dependencies to keep the image lean
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3000

# Start the server
CMD ["node", "app.js"]
