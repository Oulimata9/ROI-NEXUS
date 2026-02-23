# Utilisation d'une image Python légère
FROM python:3.11-slim

# Définition du répertoire de travail dans le conteneur
WORKDIR /code

# Installation des dépendances système nécessaires (PostgreSQL client, GCC pour les libs crypto)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie du fichier des dépendances Python
COPY ./requirements.txt /code/requirements.txt

# Installation des bibliothèques Python
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copie de tout le code source de l'application
COPY ./app /code/app

# Commande pour lancer le serveur FastAPI avec rechargement automatique
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]