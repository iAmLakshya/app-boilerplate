# ---- Base Stage ----
FROM node:23-slim AS base
ARG SERVICE_NAME
WORKDIR /app

# Install pnpm using corepack in a single layer
RUN npm install -g corepack && \
    corepack enable && \
    corepack prepare pnpm@latest --activate && \
    npm install -g nx

COPY package.json pnpm-lock.yaml* nx.json ./
COPY libs ./libs
COPY scripts ./scripts

# ---- Dependencies Stage ----
FROM base AS deps
RUN pnpm install --frozen-lockfile --recursive

# ---- Build Stage ----
FROM deps AS build
ENV NODE_ENV=production
ENV NX_DAEMON=false
COPY apps ./apps
COPY nx.json tsconfig* ./*.js ./*.ts ./ ./*.mjs ./
RUN mkdir dist
RUN pnpm nx run ${SERVICE_NAME}:build --prod --verbose

# ---- Production Stage ----
FROM node:23-alpine AS production
ARG SERVICE_NAME
ARG PORT
WORKDIR /app
ENV SERVICE=${SERVICE_NAME}
ENV PORT=${PORT}

# Copy common files
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/dist ./dist

# Copy service-specific files
COPY --from=build /app/apps/${SERVICE_NAME} ./apps/${SERVICE_NAME}
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production
CMD sh ./scripts/start-service-in-docker.sh ${SERVICE}