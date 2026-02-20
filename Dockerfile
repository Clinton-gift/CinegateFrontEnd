FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY patches/ ./patches/

RUN npm install patch-package --save-dev --legacy-peer-deps
RUN npm install postinstall-postinstall --save-dev --legacy-peer-deps

# Install dependencies with force
RUN npm install --legacy-peer-deps --no-audit --no-fund
RUN npm ci --no-audit --no-fund --legacy-peer-deps && \
    npm install --save-dev crypto-browserify stream-browserify --legacy-peer-deps
# Manually install compatible versions
RUN npm install http-server -g --legacy-peer-deps
RUN npm install @expo/webpack-config@^19.0.0 --legacy-peer-deps --no-save
# Copy source code
COPY . .

# Build the web version (for production)
RUN npx expo export:web

# Install serve to serve static files
RUN npm install -g serve

# Set environment variables
ENV NODE_ENV=production
ENV PORT=19007

EXPOSE 8080

CMD ["http-server", "web-build", "-p", "8080"]
