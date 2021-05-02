# FROM node:12.13.0-alpine
FROM node:16-buster

RUN apt-get update && \
    apt-get install -y chromium

ENV CHROME_BIN=/usr/bin/chromium-browser

RUN mkdir -p /usr/share/reports
RUN chown -R node.node /usr/share/reports

WORKDIR /usr/src/app

# COPY ./package.json /usr/src/app/package.json

COPY ./app /usr/src/app
RUN rm /usr/src/app/package-lock.json
RUN npm install
RUN npm run build

EXPOSE 3000
EXPOSE 3306

CMD npm run start