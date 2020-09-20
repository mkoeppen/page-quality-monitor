FROM node:10.15.3-alpine

WORKDIR /usr/src/app

# COPY ./package.json /usr/src/app/package.json

COPY ./src /usr/src/app
RUN npm install
RUN npm install -g pm2

EXPOSE 3000
EXPOSE 9200

CMD npm run start