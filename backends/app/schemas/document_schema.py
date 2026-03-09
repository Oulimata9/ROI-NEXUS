from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SignatureOut(BaseModel):
    id_signature: int
    email_signataire: str
    etat_signature: str
    date_signature: Optional[datetime]

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id_document: int
    titre: str
    statut: str
    date_creation: datetime
    date_envoi: Optional[datetime]
    id_createur: int

    class Config:
        from_attributes = True

class DocumentDetailOut(BaseModel):
    id_document: int
    titre: str
    statut: str
    date_creation: datetime
    date_envoi: Optional[datetime]
    id_createur: int
    id_entreprise: int
    signatures: List[SignatureOut]

    class Config:
        from_attributes = True