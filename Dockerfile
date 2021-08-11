FROM node:14

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build-ci

ENTRYPOINT ["node", "dist/server.js"]
