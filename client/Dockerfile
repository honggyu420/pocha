FROM node:16-alpine

# set the working direction
WORKDIR /usr/src/app

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN npm install

# add app
COPY . .