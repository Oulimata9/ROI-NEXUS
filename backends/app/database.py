import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker

# Récupération de l'URL de la base de données depuis les variables d'environnement
# Définie dans le fichier docker-compose.yml
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://nexus_user:nexus_password@db:5432/nexus_sign_db")

# L'engine est le moteur qui gère la communication avec PostgreSQL
engine = create_engine(DATABASE_URL, echo=True)

# Fonction pour créer les tables au démarrage (si elles n'existent pas)
def create_db_and_tables():
    # Importation locale pour éviter les imports circulaires
    from app.models.models import Entreprise, Utilisateur, Document, Signature
    SQLModel.metadata.create_all(engine)

# Dépendance pour obtenir une session de base de données dans vos routes FastAPI
def get_session():
    with Session(engine) as session:
        yield session