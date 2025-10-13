### STAGE 1: BUILD
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install --force
COPY . .
RUN npm run build --prod

### STAGE 2: RUN
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4201

