FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration npm
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application React
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine

# Copier la build React
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Santé check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
