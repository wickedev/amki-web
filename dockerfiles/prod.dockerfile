# Build
FROM node:erbium as build-stage

RUN mkdir /app
WORKDIR /app

COPY . .
RUN yarn
RUN yarn build

# Deploy
FROM node:alpine
ENV NODE_ENV production
RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn
COPY --from=build-stage /app/build build

CMD ["yarn", "start:prod"]
