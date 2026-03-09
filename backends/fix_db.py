import sys
sys.path.insert(0, '/app')

from app.database import get_session
from app.models.models import Entreprise, Utilisateur
from sqlmodel import Session, select
from passlib.context import CryptContext

# Configuration du hachage
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Connexion à la base
with Session(engine := __import__('sqlmodel').create_engine('postgresql://user:password@db:5432/nexus')) as session:
    # 1. Créer l'entreprise si elle n'existe pas
    existing_entreprise = session.exec(
        select(Entreprise).where(Entreprise.nom == "ROI Nexus")
    ).first()
    
    if not existing_entreprise:
        entreprise = Entreprise(
            nom="ROI Nexus",
            email_contact="admin@roi-nexus.com",
            statut="actif"
        )
        session.add(entreprise)
        session.commit()
        session.refresh(entreprise)
        print(f"✓ Entreprise créée: {entreprise.nom} (ID: {entreprise.id_entreprise})")
    else:
        entreprise = existing_entreprise
        print(f"✓ Entreprise existante: {entreprise.nom} (ID: {entreprise.id_entreprise})")
    
    # 2. Vérifier l'utilisateur existant et le corriger
    user = session.exec(
        select(Utilisateur).where(Utilisateur.email == "roi@gmail.com")
    ).first()
    
    if user:
        if user.id_entreprise != entreprise.id_entreprise:
            user.id_entreprise = entreprise.id_entreprise
            session.add(user)
            session.commit()
            print(f"✓ Utilisateur mis à jour: {user.nom} (ID entreprise: {entreprise.id_entreprise})")
        else:
            print(f"✓ Utilisateur OK: {user.nom}")
    else:
        # Créer l'utilisateur s'il n'existe pas
        hashed_pwd = pwd_context.hash("admin123")
        new_user = Utilisateur(
            nom="Admin ROI",
            email="roi@gmail.com",
            mot_de_passe=hashed_pwd,
            role="administrateur",
            id_entreprise=entreprise.id_entreprise
        )
        session.add(new_user)
        session.commit()
        print(f"✓ Nouvel utilisateur créé: {new_user.nom}")
    
    print("\n✅ Base de données corrigée!")
