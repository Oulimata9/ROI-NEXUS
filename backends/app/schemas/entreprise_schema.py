from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EntrepriseBase(BaseModel):
    nom: str
    email_contact: EmailStr

class EntrepriseCreate(EntrepriseBase):
    pass # On utilise les champs de base pour la création

class EntrepriseOut(EntrepriseBase):
    id_entreprise: int
    date_creation: datetime
    statut: str

    class Config:
        from_attributes = True