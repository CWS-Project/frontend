FROM node:21-alpine3.18 as build-stage
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.5-alpine
COPY --from=build-stage /build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
