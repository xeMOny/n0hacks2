FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# La imagen node:*-alpine trae un usuario "node" (uid 1000) sin privilegios;
# correr como root en el contenedor no aporta nada y amplía el daño si hay
# una RCE en alguna dependencia.
RUN chown -R node:node /app
USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]
