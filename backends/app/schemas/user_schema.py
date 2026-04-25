from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Schéma de base partagé
class UtilisateurBase(BaseModel):
    nom: str
    email: EmailStr
    role: str = "utilisateur" # administrateur / utilisateur [cite: 223, 224]

# Données requises pour l'inscription (avec mot de passe)
class UtilisateurCreate(UtilisateurBase):
    mot_de_passe: str
    id_entreprise: int

# Données renvoyées par l'API (sans le mot de passe pour la sécurité) 
class UtilisateurOut(UtilisateurBase):
    id_utilisateur: int
    date_creation: datetime

    class Config:
        from_attributes = True


class EntrepriseRegistration(BaseModel):
    nom_entreprise: str
    email_contact: EmailStr
    nom_admin: str
    email_admin: EmailStr
    mot_de_passe: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    id_user: int
    id_entreprise: int
    role: str
