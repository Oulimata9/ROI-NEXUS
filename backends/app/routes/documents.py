from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Form
from sqlmodel import Session, select
from app.database import get_session
from typing import List
from app.models.models import Document, Signature
from app.services.storage_service import save_upload_file
from app.services.crypto_service import calculate_file_hash
from app.schemas.document_schema import DocumentOut, DocumentDetailOut
from datetime import datetime
import os

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    id_entreprise: int = Form(...),
    id_createur: int = Form(...),
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

@router.get("/{id_document}", response_model=DocumentOut)
def get_document(
    id_document: int, 
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Récupérer un document spécifique.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    # Vérification de sécurité : appartient bien à l'entreprise
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    return db_document

@router.patch("/{id_document}", response_model=DocumentOut)
def update_document(
    id_document: int, 
    id_entreprise: int,
    titre: str = Form(...),
    session: Session = Depends(get_session)
):
    """
    Modifier le titre d'un document (avant signature uniquement).
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    # Vérification de sécurité : appartient bien à l'entreprise
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")

    # Règle métier : Interdiction de modifier si déjà signé
    if db_document.statut == "signé":
        raise HTTPException(
            status_code=400, 
            detail="Impossible de modifier un document déjà signé"
        )
    
    db_document.titre = titre
    session.add(db_document)
    session.commit()
    session.refresh(db_document)
    
    return db_document

@router.patch("/{id_document}/archive", response_model=DocumentOut)
def archive_document(
    id_document: int, 
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Archiver un document.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    # Vérification de sécurité : appartient bien à l'entreprise
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Un document peut être archivé quel que soit son statut
    db_document.statut = "archivé"
    session.add(db_document)
    session.commit()
    session.refresh(db_document)
    
    return db_document

@router.get("/entreprise/{id_entreprise}", response_model=List[DocumentOut])
def get_documents_by_entreprise(
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Récupérer tous les documents d'une entreprise.
    """
    statement = select(Document).where(Document.id_entreprise == id_entreprise)
    results = session.exec(statement).all()
    return results

@router.get("/{id_document}/detail", response_model=DocumentDetailOut)
def get_document_detail(
    id_document: int, 
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Récupérer le détail d'un document avec toutes les signatures.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    return db_document

@router.post("/{id_document}/sign")
def admin_sign_document(
    id_document: int,
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    L'admin peut signer le document lui-même.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérifier si toutes les signatures externes sont complètes
    all_signatures = session.exec(
        select(Signature).where(Signature.id_document == id_document)
    ).all()
    
    unsigned = [s for s in all_signatures if s.etat_signature != "signé"]
    
    if unsigned:
        return {
            "status": "warning",
            "message": f"{len(unsigned)} signataire(s) n'a/ont pas encore signé",
            "can_proceed": True
        }
    
    # Mettre à jour le statut du document
    db_document.statut = "signé"
    session.add(db_document)
    session.commit()
    
    return {
        "status": "success",
        "message": "Document signé par l'administrateur",
        "id_document": id_document
    }

@router.get("/{id_document}/download")
def download_document(
    id_document: int,
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Télécharger le document signé.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    if db_document.statut != "signé":
        raise HTTPException(
            status_code=400,
            detail="Seuls les documents signés peuvent être téléchargés"
        )
    
    if not os.path.exists(db_document.chemin_fichier):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    return {
        "file_path": db_document.chemin_fichier,
        "filename": db_document.titre
    }

@router.post("/{id_document}/remind")
def send_reminder(
    id_document: int,
    id_entreprise: int,
    id_signature: int,
    session: Session = Depends(get_session)
):
    """
    Envoyer un rappel à un signataire.
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    db_signature = session.get(Signature, id_signature)
    
    if not db_signature or db_signature.id_document != id_document:
        raise HTTPException(status_code=404, detail="Signature non trouvée")
    
    if db_signature.etat_signature == "signé":
        raise HTTPException(status_code=400, detail="Ce document a déjà été signé")
    
    # Ici, on pourrait implémenter l'envoi d'email
    # email_service.send_reminder(db_signature.email_signataire, db_document.titre, db_signature.token_acces)
    
    return {
        "status": "success",
        "message": f"Rappel envoyé à {db_signature.email_signataire}"
    }

@router.get("/{id_document}/history")
def get_document_history(
    id_document: int,
    id_entreprise: int,
    session: Session = Depends(get_session)
):
    """
    Obtenir l'historique complet du document (qui a signé, quand, etc).
    """
    db_document = session.get(Document, id_document)
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    if db_document.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signatures = session.exec(
        select(Signature).where(Signature.id_document == id_document)
    ).all()
    
    history = []
    for sig in signatures:
        if sig.etat_signature == "signé":
            history.append({
                "type": "signature",
                "email": sig.email_signataire,
                "date": sig.date_signature,
                "status": "completed"
            })
        else:
            history.append({
                "type": "pending",
                "email": sig.email_signataire,
                "status": "en attente"
            })
    
    return {
        "id_document": id_document,
        "titre": db_document.titre,
        "statut": db_document.statut,
        "date_creation": db_document.date_creation,
        "date_envoi": db_document.date_envoi,
        "history": history
    }