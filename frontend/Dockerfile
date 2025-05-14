FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

from nginx:alpine

copy --from=build /app/dist /usr/share/nginx/html

expose 80

cmd ["nginx", "-g", "daemon off;"]