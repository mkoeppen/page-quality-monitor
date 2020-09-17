FROM node:10

# CREATE APP DIRECTORY
WORKDIR /app

# Bundle app source
COPY ./server/src ./

# INSTALL DEPENDENCIES
RUN npm install

# Create new User
RUN useradd -ms /bin/bash pqm

# Change User
USER pqm

EXPOSE 8080
CMD [ "node", "server.js" ]