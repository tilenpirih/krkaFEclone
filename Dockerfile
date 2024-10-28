FROM oven/bun:1.1.21 AS base

WORKDIR /usr/src/app

FROM base AS build

ENV NODE_ENV=production

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN bun install
RUN bun run build

FROM base AS app

COPY --from=build /usr/src/app/.output /prod/app
WORKDIR /prod/app

EXPOSE 3001

CMD [ "bun", "run", "server/index.mjs" ]
