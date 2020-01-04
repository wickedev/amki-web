FROM node:lts-alpine

ENV PORT 8080

ENV NODE_ENV production

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY build .

EXPOSE 8080

CMD ["node", "server.js"]
