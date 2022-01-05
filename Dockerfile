FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json yarn.* ./

RUN chown -R node:node /home/node

COPY . /home/node/app/

RUN npm i

CMD npm run dev
