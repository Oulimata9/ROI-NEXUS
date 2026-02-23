from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from typing import List
from app.models.models import Document
from app.services.storage_service import save_upload_file
from app.services.crypto_service import calculate_file_hash
from app.schemas.document_schema import DocumentOut
import os

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    id_entreprise: int,
    id_createur: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """
    Route pour importer un document PDF, calculer son empreinte numérique 
    et l'enregistrer en base de données pour l'entreprise propriétaire.
    """
    # 1. Validation du format de fichier (Règle métier : PDF uniquement)
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Seuls les fichiers PDF sont acceptés pour la signature."
        )

    # 2. Lecture du contenu pour le hachage cryptographique
    content = await file.read()
    
    # 3. Calcul du hash original (Garantie d'intégrité et traçabilité)
    document_hash = calculate_file_hash(content)

    # 4. Sauvegarde physique du fichier sur le serveur (via Storage Service)
    # On remet le pointeur au début car on a lu le fichier pour le hash
    file.file.seek(0)
    file_path = save_upload_file(file)

    # 5. Enregistrement des métadonnées en base de données
    new_doc = Document(
        titre=file.filename,
        statut="brouillon", # Statut initial selon votre cycle de vie
        chemin_fichier=file_path,
        hash_original=document_hash,
        id_entreprise=id_entreprise,
        id_createur=id_createur
    )
    
    session.add(new_doc)
    session.commit()
    session.refresh(new_doc)
    
    return new_doc

@router.get("/", response_model=List[Document])
def read_documents(
    id_entreprise: int, 
    session: Session = Depends(get_session)
):
    """
    Lister les documents de l'entreprise.
    Règle : Une entreprise ne peut pas accéder aux documents d’une autre entreprise[cite: 48, 58, 170].
    """
    statement = select(Document).where(Document.id_entreprise == id_entreprise)
    results = session.exec(statement).all()
    return results

@router.delete("/{id_document}")
def delete_document(
    id_document: int, 
    id_entreprise: int, 
    session: Session = Depends(get_session)
):
    """
    Supprimer un document.
    Règle : Un document ne peut pas être modifié (ou supprimé) après signature[cite: 109, 141, 166].
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    # Vérification de sécurité : appartient bien à l'entreprise
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")

    # Règle métier : Interdiction si déjà signé
    if db_document.statut == "signé":
        raise HTTPException(
            status_code=400, 
            detail="Impossible de supprimer un document déjà signé (archivage obligatoire) [cite: 109, 131]"
        )

    # Suppression du fichier physique
    if os.path.exists(db_document.chemin_fichier):
        os.remove(db_document.chemin_fichier)

    session.delete(db_document)
    session.commit()
    return {"message": "Document supprimé avec succès"}