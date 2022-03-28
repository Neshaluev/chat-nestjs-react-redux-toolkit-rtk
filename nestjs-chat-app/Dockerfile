FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=production

WORKDIR /usr/src/api

COPY package.json .
COPY package-lock.json .

RUN npm install -g @nestjs/cli
RUN npm install --production=true

RUN apt-get -q update && apt-get -qy install netcat

COPY . .

RUN npm run build 

CMD ["sh", "-c", "npm run start:prod"]