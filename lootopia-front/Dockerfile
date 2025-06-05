# Stage 1: Build de l'application
FROM node:18-alpine AS builder

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Installation d'Angular CLI
RUN npm install -g @angular/cli@19.2.9

# Copie des fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm install --legacy-peer-deps

# Copie du reste des fichiers
COPY . .

# Build de production standard
RUN ng build --configuration=production

# Stage 2: Serveur de production avec Nginx
FROM nginx:alpine

# Copie des fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist/lootopia-front /usr/share/nginx/html

# Configuration Nginx par défaut pour Angular
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


