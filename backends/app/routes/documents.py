import os
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlmodel import Session, select

from app.database import get_session
from app.models.models import Document, Signature, Utilisateur
from app.schemas.document_schema import DocumentDetailOut, DocumentOut
from app.security import ensure_enterprise_scope, ensure_user_scope, get_current_user
from app.services.crypto_service import calculate_file_hash
from app.services.email_service import send_signature_reminder
from app.services.storage_service import save_upload_file

router = APIRouter(prefix="/documents", tags=["Documents"])


def get_owned_document(id_document: int, session: Session, current_user: Utilisateur) -> Document:
    document = session.get(Document, id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    if document.id_entreprise != current_user.id_entreprise:
        raise HTTPException(status_code=403, detail="Acces refuse")

    return document


def validate_request_scope(
    current_user: Utilisateur,
    requested_enterprise_id: Optional[int] = None,
    requested_user_id: Optional[int] = None,
) -> None:
    ensure_enterprise_scope(requested_enterprise_id, current_user)
    ensure_user_scope(requested_user_id, current_user)


@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    id_entreprise: Optional[int] = Form(None),
    id_createur: Optional[int] = Form(None),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Importe un PDF pour l'entreprise de l'utilisateur connecte.
    """
    validate_request_scope(current_user, id_entreprise, id_createur)

    filename = file.filename or "document.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seuls les fichiers PDF sont acceptes pour la signature.",
        )

    content = await file.read()
    document_hash = calculate_file_hash(content)

    file.file.seek(0)
    file_path = save_upload_file(file, current_user.id_entreprise)

    new_doc = Document(
        titre=filename,
        statut="brouillon",
        chemin_fichier=file_path,
        hash_original=document_hash,
        id_entreprise=current_user.id_entreprise,
        id_createur=current_user.id_utilisateur,
    )

    session.add(new_doc)
    session.commit()
    session.refresh(new_doc)

    return new_doc


@router.get("/", response_model=List[DocumentOut])
def read_documents(
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Liste les documents de l'entreprise du compte connecte.
    """
    validate_request_scope(current_user, id_entreprise)

    statement = select(Document).where(Document.id_entreprise == current_user.id_entreprise)
    return session.exec(statement).all()


@router.delete("/{id_document}")
def delete_document(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Supprime un document non signe appartenant a l'entreprise courante.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    if db_document.statut == "signé":
        raise HTTPException(
            status_code=400,
            detail="Impossible de supprimer un document deja signe",
        )

    if os.path.exists(db_document.chemin_fichier):
        os.remove(db_document.chemin_fichier)

    session.delete(db_document)
    session.commit()
    return {"message": "Document supprime avec succes"}


@router.get("/{id_document}", response_model=DocumentOut)
def get_document(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Recupere un document de l'entreprise courante.
    """
    validate_request_scope(current_user, id_entreprise)
    return get_owned_document(id_document, session, current_user)


@router.patch("/{id_document}", response_model=DocumentOut)
def update_document(
    id_document: int,
    titre: str = Form(...),
    id_entreprise: Optional[int] = Form(None),
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Modifie le titre d'un document avant signature.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    if db_document.statut == "signé":
        raise HTTPException(status_code=400, detail="Impossible de modifier un document deja signe")

    db_document.titre = titre
    session.add(db_document)
    session.commit()
    session.refresh(db_document)

    return db_document


@router.patch("/{id_document}/archive", response_model=DocumentOut)
def archive_document(
    id_document: int,
    id_entreprise: Optional[int] = Form(None),
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Archive un document appartenant a l'entreprise courante.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    db_document.statut = "archivé"
    session.add(db_document)
    session.commit()
    session.refresh(db_document)

    return db_document


@router.get("/entreprise/{id_entreprise}", response_model=List[DocumentOut])
def get_documents_by_entreprise(
    id_entreprise: int,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Recupere tous les documents de l'entreprise du compte connecte.
    """
    validate_request_scope(current_user, id_entreprise)

    statement = select(Document).where(Document.id_entreprise == current_user.id_entreprise)
    return session.exec(statement).all()


@router.get("/{id_document}/detail", response_model=DocumentDetailOut)
def get_document_detail(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Recupere le detail d'un document avec ses signatures.
    """
    validate_request_scope(current_user, id_entreprise)
    return get_owned_document(id_document, session, current_user)


@router.post("/{id_document}/sign")
def admin_sign_document(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Marque le document comme signe si toutes les signatures attendues sont presentes.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    all_signatures = session.exec(select(Signature).where(Signature.id_document == id_document)).all()
    unsigned = [signature for signature in all_signatures if signature.etat_signature != "signé"]

    if unsigned:
        return {
            "status": "warning",
            "message": f"{len(unsigned)} signataire(s) n'a/ont pas encore signe",
            "can_proceed": True,
        }

    db_document.statut = "signé"
    session.add(db_document)
    session.commit()

    return {
        "status": "success",
        "message": "Document signe par l'administrateur",
        "id_document": id_document,
    }


@router.get("/{id_document}/download")
def download_document(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Telecharge un document signe de l'entreprise courante.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    if db_document.statut != "signé":
        raise HTTPException(
            status_code=400,
            detail="Seuls les documents signes peuvent etre telecharges",
        )

    if not os.path.exists(db_document.chemin_fichier):
        raise HTTPException(status_code=404, detail="Fichier non trouve")

    filename = db_document.titre if db_document.titre.lower().endswith(".pdf") else f"{db_document.titre}.pdf"
    return FileResponse(db_document.chemin_fichier, media_type="application/pdf", filename=filename)


@router.post("/{id_document}/remind")
def send_reminder(
    id_document: int,
    id_signature: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Prepare un rappel pour un signataire du document courant.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    db_signature = session.get(Signature, id_signature)
    if not db_signature or db_signature.id_document != id_document:
        raise HTTPException(status_code=404, detail="Signature non trouvee")

    if db_signature.etat_signature == "signé":
        raise HTTPException(status_code=400, detail="Ce document a deja ete signe")

    email_result = send_signature_reminder(
        db_signature.email_signataire,
        db_document.titre,
        db_signature.token_acces,
    )

    return {
        "status": "success",
        "message": f"Rappel traite pour {db_signature.email_signataire}",
        "document": db_document.titre,
        "email": email_result.to_dict(),
    }


@router.get("/{id_document}/history")
def get_document_history(
    id_document: int,
    id_entreprise: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """
    Retourne l'historique des signatures d'un document de l'entreprise courante.
    """
    validate_request_scope(current_user, id_entreprise)
    db_document = get_owned_document(id_document, session, current_user)

    signatures = session.exec(select(Signature).where(Signature.id_document == id_document)).all()

    history = []
    for signature in signatures:
        if signature.etat_signature == "signé":
            history.append(
                {
                    "type": "signature",
                    "email": signature.email_signataire,
                    "date": signature.date_signature,
                    "status": "completed",
                }
            )
        else:
            history.append(
                {
                    "type": "pending",
                    "email": signature.email_signataire,
                    "status": "en attente",
                }
            )

    return {
        "id_document": id_document,
        "titre": db_document.titre,
        "statut": db_document.statut,
        "date_creation": db_document.date_creation,
        "date_envoi": db_document.date_envoi,
        "history": history,
    }
