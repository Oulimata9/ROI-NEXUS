from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.database import get_session
from app.models.models import Utilisateur
from app.schemas.user_schema import UtilisateurCreate, UtilisateurOut
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional

# --- CONFIGURATION DE SÉCURITÉ ---
# Dans un projet réel, ces valeurs devraient être dans un fichier .env
SECRET_KEY = "NEXUS_SECRET_KEY_PROD_2026_AFRIQUE_SIGN" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # Le token expire après 24 heures

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["Authentification"])

# --- FONCTIONS UTILITAIRES ---

def create_access_token(data: dict):
    """Génère un jeton JWT signé."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- ROUTES API ---

@router.post("/signup", response_model=UtilisateurOut)
def signup(user_data: UtilisateurCreate, session: Session = Depends(get_session)):
    """
    Permet de créer un compte utilisateur rattaché à une entreprise.
    """
    # 1. Vérifier si l'email existe déjà (doit être unique)
    existing_user = session.query(Utilisateur).filter(Utilisateur.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cet email est déjà enregistré."
        )
    
    # 2. Hacher le mot de passe pour la sécurité 
    hashed_pwd = pwd_context.hash(user_data.mot_de_passe)
    
    # 3. Création de l'utilisateur
    new_user = Utilisateur(
        nom=user_data.nom,
        email=user_data.email,
        mot_de_passe=hashed_pwd,
        role=user_data.role,
        id_entreprise=user_data.id_entreprise
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """
    Vérifie les identifiants (email/password) et retourne un Token JWT.
    Note: form_data.username correspond à l'email de l'utilisateur.
    """
    # 1. Chercher l'utilisateur par son email
    user = session.query(Utilisateur).filter(Utilisateur.email == form_data.username).first()
    
    # 2. Vérifier l'existence et le mot de passe
    if not user or not pwd_context.verify(form_data.password, user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Générer le token avec les données utiles
    # Ces infos seront récupérables par le backend sur chaque requête protégée
    access_token = create_access_token(
        data={
            "sub": user.email, 
            "id_user": user.id_utilisateur, 
            "id_entreprise": user.id_entreprise,
            "role": user.role
        }
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_name": user.nom
    }