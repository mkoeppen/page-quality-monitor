FROM node:12.13.0-alpine

WORKDIR /usr/src/app

# COPY ./package.json /usr/src/app/package.json

COPY ./app /usr/src/app
RUN npm install

EXPOSE 3000
EXPOSE 3306

CMD npm run start