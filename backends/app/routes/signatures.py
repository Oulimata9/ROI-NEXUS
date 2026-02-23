from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import Document, Signature
from app.services.pdf_service import PDFService
from app.services.crypto_service import generate_secure_token
from datetime import datetime
import os

router = APIRouter(prefix="/signatures", tags=["Signatures"])

@router.post("/invite/{id_document}")
def invite_signataire(
    id_document: int, 
    email_signataire: str, 
    session: Session = Depends(get_session)
):
    """
    Génère un jeton sécurisé pour un signataire externe.
    Règle métier : Le signataire n'a pas besoin de compte.
    """
    document = session.get(Document, id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouvé")

    # Génération du token unique de 48 caractères (via crypto_service)
    token = generate_secure_token()

    new_signature = Signature(
        id_document=id_document,
        email_signataire=email_signataire,
        token_acces=token,
        statut="en attente"
    )
    
    session.add(new_signature)
    session.commit()
    
    # Ici, vous pourriez appeler votre email_service pour envoyer le lien
    # lien = f"http://localhost/sign/{token}"
    
    return {"message": "Invitation envoyée", "token": token}

@router.post("/sign/{token}")
def sign_document(
    token: str, 
    nom_visuel: str, 
    x: int, 
    y: int, 
    page: int = 0, 
    session: Session = Depends(get_session)
):
    """
    Action finale de signature : fusionne la signature sur le PDF et verrouille le document.
    """
    # 1. Vérifier le token
    statement = select(Signature).where(Signature.token_acces == token)
    sig_entry = session.exec(statement).first()
    
    if not sig_entry or sig_entry.statut == "signé":
        raise HTTPException(status_code=400, detail="Lien invalide ou déjà utilisé")

    document = session.get(Document, sig_entry.id_document)
    
    # 2. Définir les chemins de fichiers
    input_path = document.chemin_fichier
    output_path = input_path.replace(".pdf", "_signed.pdf")

    # 3. Appeler le service PDF pour l'overlay visuel
    signature_data = {
        "nom_signataire": nom_visuel,
        "date": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "x": x,
        "y": y,
        "page": page
    }
    
    try:
        PDFService.add_signature_overlay(input_path, output_path, signature_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération du PDF : {str(e)}")

    # 4. Mettre à jour la base de données (Règles métier : archivage et verrouillage)
    sig_entry.statut = "signé"
    sig_entry.date_signature = datetime.now()
    
    document.statut = "signé"
    document.chemin_fichier = output_path # On pointe vers la version signée
    
    session.add(sig_entry)
    session.add(document)
    session.commit()

    return {"message": "Document signé avec succès", "archive_path": output_path}