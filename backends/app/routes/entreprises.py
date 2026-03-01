from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import Entreprise
from typing import List

router = APIRouter(prefix="/entreprises", tags=["Entreprises"])

@router.post("/", response_model=Entreprise, status_code=status.HTTP_201_CREATED)
def create_entreprise(entreprise: Entreprise, session: Session = Depends(get_session)):
    """
    Crée une nouvelle entreprise dans le système. 
    Indispensable avant de pouvoir créer un utilisateur rattaché.
    """
    # Vérifier si l'entreprise existe déjà par son nom (optionnel)
    existing = session.exec(select(Entreprise).where(Entreprise.nom == entreprise.nom)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cette entreprise est déjà enregistrée.")
    
    session.add(entreprise)
    session.commit()
    session.refresh(entreprise)
    return entreprise

@router.get("/", response_model=List[Entreprise])
def list_entreprises(session: Session = Depends(get_session)):
    """Liste toutes les entreprises enregistrées."""
    return session.exec(select(Entreprise)).all()