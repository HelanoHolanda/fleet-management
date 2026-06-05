FROM node:20-bookworm-slim AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM base AS build

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
