from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from app.database import create_db_and_tables, get_session
from app.models.models import Entreprise
from app.routes import auth, documents, signatures, entreprises # On prépare l'import de la route auth et documents
from typing import List

app = FastAPI(
    title="ROI NEXUS - API de Signature Électronique",
    description="Backend sécurisé pour l'Afrique",
    version="1.0.0"
)

# Configuration du CORS pour permettre au Frontend de communiquer avec le Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En développement, on autorise tout
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/", tags=["Initialisation"])
async def root():
    return {"message": "Bienvenue sur l'API Nexus Sign", "statut": "Opérationnel"}

# Inclusion des futurs routeurs
app.include_router(auth.router) # Assure-toi que app/routes/auth.py existe
app.include_router(documents.router)
app.include_router(signatures.router)
app.include_router(entreprises.router)
