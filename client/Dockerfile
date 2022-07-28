FROM node:16
WORKDIR /app

COPY package*.json ./

RUN npm config set legacy-peer-deps true
RUN npm install

COPY . .

EXPOSE 8021

CMD [ "npm", "start" ]