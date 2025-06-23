# Etapa 1: Compilación de la aplicación Angular
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod -- --base-href /HistoriasClinicas/

# Etapa 2: Servir la aplicación con NGINX
FROM nginx:alpine
COPY --from=build /app/dist/historiasClinicas /usr/share/nginx/html

# Copiar el archivo de configuración de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4201
#EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
