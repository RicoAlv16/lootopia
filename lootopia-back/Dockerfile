FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Installation d'Angular CLI
RUN npm install -g @nestjs/cli

# Copie des fichiers de configuration
COPY package*.json ./

# Installation des dépendances avec plus de verbosité
RUN npm install --legacy-peer-deps --verbose

# Copie du reste des fichiers
COPY . .

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true

# Commande de démarrage modifiée avec plus d'options
CMD ["npm", "run", "start:prod"]


