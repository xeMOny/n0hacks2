FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Imagen oficial preparada para correr sin root: escucha en 8080 en vez de 80
# (los puertos <1024 requieren privilegios que este contenedor no tiene).
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
