from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Entreprise(SQLModel, table=True):
    id_entreprise: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(index=True)
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    statut: str = Field(default="actif")
    email_contact: str = Field(unique=True)

    utilisateurs: List["Utilisateur"] = Relationship(back_populates="entreprise")
    documents: List["Document"] = Relationship(back_populates="entreprise")


class Utilisateur(SQLModel, table=True):
    id_utilisateur: Optional[int] = Field(default=None, primary_key=True)
    nom: str
    email: str = Field(unique=True, index=True)
    mot_de_passe: str
    role: str = Field(default="utilisateur")
    date_creation: datetime = Field(default_factory=datetime.utcnow)

    id_entreprise: int = Field(foreign_key="entreprise.id_entreprise")
    entreprise: Entreprise = Relationship(back_populates="utilisateurs")
    documents_crees: List["Document"] = Relationship(back_populates="createur")


class Document(SQLModel, table=True):
    id_document: Optional[int] = Field(default=None, primary_key=True)
    titre: str
    statut: str = Field(default="brouillon")
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    date_envoi: Optional[datetime] = None
    chemin_fichier: str
    hash_original: str

    id_entreprise: int = Field(foreign_key="entreprise.id_entreprise")
    entreprise: Entreprise = Relationship(back_populates="documents")

    id_createur: int = Field(foreign_key="utilisateur.id_utilisateur")
    createur: Utilisateur = Relationship(back_populates="documents_crees")

    signatures: List["Signature"] = Relationship(back_populates="document")


class Signature(SQLModel, table=True):
    id_signature: Optional[int] = Field(default=None, primary_key=True)
    date_signature: Optional[datetime] = None
    email_signataire: str
    etat_signature: str = Field(default="en attente")
    token_acces: str = Field(unique=True)
    type_signature: str = Field(default="draw")
    otp_requis: bool = Field(default=False)
    otp_code_hash: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    otp_verified_at: Optional[datetime] = None
    otp_last_sent_at: Optional[datetime] = None

    id_document: int = Field(foreign_key="document.id_document")
    document: Document = Relationship(back_populates="signatures")
