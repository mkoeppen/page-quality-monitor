FROM node:16-buster AS builder
WORKDIR /usr/src/app
COPY ./app /usr/src/app
RUN rm /usr/src/app/package-lock.json
RUN npm install
RUN npm run build

FROM node:16-buster

RUN apt-get update && \
    apt-get install -y chromium

ENV CHROME_BIN=/usr/bin/chromium-browser

RUN mkdir -p /usr/share/reports
RUN chown -R node.node /usr/share/reports

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.nuxt /usr/src/app/.nuxt
COPY ./app/nuxt.config.js /usr/src/app/nuxt.config.js
COPY ./app/package.json /usr/src/app/package.json
COPY ./app/server /usr/src/app/server
COPY ./app/assets /usr/src/app/assets
COPY ./app/static /usr/src/app/static
COPY ./app/config /usr/src/app/config
COPY ./app/db /usr/src/app/db
RUN npm install --only=prod

EXPOSE 3000
EXPOSE 3306

CMD npm run start