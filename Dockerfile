FROM node:20.18.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

USER node

CMD ["node", "dist/main"]