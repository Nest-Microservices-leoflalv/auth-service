FROM node:23.8.0-alpine3.20

# Install build dependencies for native modules
RUN apk add --no-cache make g++ python3

# Force building bcrypt from source
# ENV npm_config_build_from_source=bcrypt

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

# Clear any pnpm cache and force reinstall dependencies
RUN pnpm store prune && pnpm install --force

COPY . .

EXPOSE 3007
