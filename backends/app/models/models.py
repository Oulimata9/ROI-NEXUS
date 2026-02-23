from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

# 1️⃣ CLASSE ENTREPRISE
class Entreprise(SQLModel, table=True):
    id_entreprise: Optional[int] = Field(default=None, primary_key=True)
    nom: str = Field(index=True) # Obligatoire [cite: 281]
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    statut: str = Field(default="actif") # actif / suspendu [cite: 301]
    email_contact: str = Field(unique=True)
    
    # Relations [cite: 431]
    utilisateurs: List["Utilisateur"] = Relationship(back_populates="entreprise")
    documents: List["Document"] = Relationship(back_populates="entreprise")

# 2️⃣ CLASSE UTILISATEUR
class Utilisateur(SQLModel, table=True):
    id_utilisateur: Optional[int] = Field(default=None, primary_key=True)
    nom: str
    email: str = Field(unique=True, index=True) # Unique [cite: 282]
    mot_de_passe: str # Chiffré [cite: 283]
    role: str = Field(default="utilisateur") # administrateur / utilisateur [cite: 137]
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    
    id_entreprise: int = Field(foreign_key="entreprise.id_entreprise")
    entreprise: Entreprise = Relationship(back_populates="utilisateurs")
    documents_crees: List["Document"] = Relationship(back_populates="createur")

# 3️⃣ CLASSE DOCUMENT
class Document(SQLModel, table=True):
    id_document: Optional[int] = Field(default=None, primary_key=True)
    titre: str
    statut: str = Field(default="brouillon") # brouillon / envoyé / signé [cite: 301]
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    date_envoi: Optional[datetime] = None
    chemin_fichier: str # Chemin vers le stockage sécurisé [cite: 145]
    hash_original: str # Empreinte numérique pour l'intégrité [cite: 140]
    
    id_entreprise: int = Field(foreign_key="entreprise.id_entreprise")
    entreprise: Entreprise = Relationship(back_populates="documents")
    
    id_createur: int = Field(foreign_key="utilisateur.id_utilisateur")
    createur: Utilisateur = Relationship(back_populates="documents_crees")
    
    signatures: List["Signature"] = Relationship(back_populates="document")

# 4️⃣ CLASSE SIGNATURE
class Signature(SQLModel, table=True):
    id_signature: Optional[int] = Field(default=None, primary_key=True)
    date_signature: Optional[datetime] = None # Généré à la signature [cite: 331]
    email_signataire: str # Signataire externe [cite: 315]
    etat_signature: str = Field(default="en attente") # signé / en attente [cite: 301]
    token_acces: str = Field(unique=True) # Lien sécurisé unique [cite: 117]
    
    id_document: int = Field(foreign_key="document.id_document")
    document: Document = Relationship(back_populates="signatures")