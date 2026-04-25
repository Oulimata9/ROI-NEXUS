from datetime import datetime

from pydantic import BaseModel, EmailStr


class NexusEntrepriseRegistration(BaseModel):
    nom_entreprise: str
    email_contact: EmailStr
    nom_admin: str
    email_admin: EmailStr
    mot_de_passe: str


class NexusEntrepriseOut(BaseModel):
    id_entreprise: int
    nom_entreprise: str
    email_contact: EmailStr
    statut: str
    date_creation: datetime
    admin_id: int
    admin_nom: str
    admin_email: EmailStr
    admin_role: str
