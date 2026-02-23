# Étape 1 : Construction du frontend (Vite/React)
FROM node:18-alpine AS build
WORKDIR /app

# Copie des fichiers de dépendances
# Utiliser package*.json permet de copier aussi le package-lock.json s'il existe
COPY package*.json ./

# Installation des dépendances
# On garde --legacy-peer-deps car vos dépendances Radix/Shadcn sont sensibles aux versions
RUN npm install --legacy-peer-deps

# Copie de tout le code source
COPY . .

# Utilisation de npm run build au lieu de npx pour plus de fiabilité
RUN npm run build

# Étape 2 : Service avec Nginx
FROM nginx:stable-alpine

# Copie du dossier de sortie de Vite (dist) vers Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copie de votre configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]