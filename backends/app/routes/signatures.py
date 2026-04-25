from datetime import datetime, timedelta
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.exc import ProgrammingError
from sqlmodel import Session, select

from app.config import settings
from app.database import get_session
from app.models.models import Document, Signature, Utilisateur
from app.schemas.signature_schema import PublicSignatureStatusOut, SignatureValidationIn
from app.security import get_current_user
from app.services.crypto_service import generate_otp, generate_secure_token, hash_secret, verify_secret
from app.services.email_service import send_signature_invitation, send_signature_otp
from app.services.pdf_service import PDFService
from app.services.storage_service import build_signed_file_path

router = APIRouter(prefix="/signatures", tags=["Signatures"])

SIGNATURE_TYPE_DRAW = "draw"
SIGNATURE_TYPE_NUMERIQUE_OTP = "numerique_otp"
ALLOWED_SIGNATURE_TYPES = {SIGNATURE_TYPE_DRAW, SIGNATURE_TYPE_NUMERIQUE_OTP}
OTP_LIFETIME_MINUTES = 10


def raise_migration_error(exc: ProgrammingError) -> None:
    error_message = str(exc).lower()
    if "type_signature" in error_message or "otp_" in error_message:
        raise HTTPException(
            status_code=500,
            detail="La base de donnees n'est pas a jour. Executez d'abord: alembic stamp 20260422_0001 puis alembic upgrade head.",
        ) from exc

    raise exc


def validate_signature_type(signature_type: str) -> str:
    normalized_type = (signature_type or SIGNATURE_TYPE_DRAW).strip().lower()
    if normalized_type not in ALLOWED_SIGNATURE_TYPES:
        raise HTTPException(status_code=400, detail="Type de signature non supporte")
    return normalized_type


def get_document_for_current_user(id_document: int, session: Session, current_user: Utilisateur) -> Document:
    document = session.get(Document, id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    if document.id_entreprise != current_user.id_entreprise:
        raise HTTPException(status_code=403, detail="Acces refuse")

    return document


def get_signature_by_token(token: str, session: Session) -> Signature:
    signature = session.exec(select(Signature).where(Signature.token_acces == token)).first()
    if not signature:
        raise HTTPException(status_code=404, detail="Lien de signature introuvable")
    return signature


def build_public_signature_status(token: str, session: Session) -> PublicSignatureStatusOut:
    signature = get_signature_by_token(token, session)
    document = session.get(Document, signature.id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    all_signatures = session.exec(select(Signature).where(Signature.id_document == document.id_document)).all()
    completed_signatures = sum(1 for item in all_signatures if item.etat_signature == "signé")

    return PublicSignatureStatusOut(
        token=token,
        document_id=document.id_document,
        document_title=document.titre,
        document_status=document.statut,
        document_created_at=document.date_creation,
        document_sent_at=document.date_envoi,
        current_signer_email=signature.email_signataire,
        current_signature_status=signature.etat_signature,
        current_signature_date=signature.date_signature,
        signature_type=signature.type_signature,
        otp_required=signature.otp_requis,
        otp_verified=signature.otp_verified_at is not None,
        otp_expires_at=signature.otp_expires_at,
        total_signers=len(all_signatures),
        completed_signers=completed_signatures,
        can_sign=signature.etat_signature != "signé" and document.statut != "archivé",
        can_download=document.statut == "signé",
    )


@router.get("/public/{token}", response_model=PublicSignatureStatusOut)
def get_public_signature_status(
    token: str,
    session: Session = Depends(get_session),
):
    return build_public_signature_status(token, session)


@router.post("/invite/{id_document}")
def invite_signataire(
    id_document: int,
    email_signataire: str,
    signature_type: str = SIGNATURE_TYPE_DRAW,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    if not email_signataire:
        raise HTTPException(status_code=400, detail="L'email du signataire est obligatoire")

    document = get_document_for_current_user(id_document, session, current_user)

    if document.statut in {"signé", "archivé"}:
        raise HTTPException(status_code=400, detail="Ce document ne peut plus etre envoye en signature")

    resolved_signature_type = validate_signature_type(signature_type)
    token = generate_secure_token()

    new_signature = Signature(
        id_document=id_document,
        email_signataire=email_signataire,
        token_acces=token,
        etat_signature="en attente",
        type_signature=resolved_signature_type,
        otp_requis=resolved_signature_type == SIGNATURE_TYPE_NUMERIQUE_OTP,
    )

    if document.statut == "brouillon":
        document.statut = "en attente"

    if document.date_envoi is None:
        document.date_envoi = datetime.utcnow()

    session.add(new_signature)
    session.add(document)
    try:
        session.commit()
    except ProgrammingError as exc:
        session.rollback()
        raise_migration_error(exc)
    session.refresh(new_signature)

    email_result = send_signature_invitation(email_signataire, document.titre, token)

    return {
        "message": "Invitation creee",
        "token": token,
        "id_signature": new_signature.id_signature,
        "signature_type": resolved_signature_type,
        "otp_required": new_signature.otp_requis,
        "email": email_result.to_dict(),
    }


@router.post("/otp/send/{token}")
def send_signature_otp_code(
    token: str,
    session: Session = Depends(get_session),
):
    signature = get_signature_by_token(token, session)
    if signature.etat_signature == "signé":
        raise HTTPException(status_code=400, detail="Ce lien a deja ete utilise")

    if signature.type_signature != SIGNATURE_TYPE_NUMERIQUE_OTP or not signature.otp_requis:
        raise HTTPException(status_code=400, detail="Ce signataire n'utilise pas la signature numerique OTP")

    document = session.get(Document, signature.id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    otp_code = generate_otp()
    signature.otp_code_hash = hash_secret(otp_code)
    signature.otp_expires_at = datetime.utcnow() + timedelta(minutes=OTP_LIFETIME_MINUTES)
    signature.otp_verified_at = None
    signature.otp_last_sent_at = datetime.utcnow()

    session.add(signature)
    try:
        session.commit()
    except ProgrammingError as exc:
        session.rollback()
        raise_migration_error(exc)

    email_result = send_signature_otp(signature.email_signataire, document.titre, otp_code)
    otp_preview = otp_code if not settings.is_production and not email_result.sent else None

    return {
        "message": "Code OTP genere",
        "expires_at": signature.otp_expires_at,
        "email": email_result.to_dict(),
        "otp_preview": otp_preview,
    }


@router.post("/sign/{token}")
def sign_document(
    token: str,
    payload: SignatureValidationIn,
    session: Session = Depends(get_session),
):
    sig_entry = get_signature_by_token(token, session)
    if sig_entry.etat_signature == "signé":
        raise HTTPException(status_code=400, detail="Lien deja utilise")

    document = session.get(Document, sig_entry.id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    if sig_entry.type_signature == SIGNATURE_TYPE_NUMERIQUE_OTP:
        if not payload.otp_code:
            raise HTTPException(status_code=400, detail="Le code OTP est obligatoire pour ce type de signature")

        if not sig_entry.otp_code_hash or not sig_entry.otp_expires_at:
            raise HTTPException(status_code=400, detail="Aucun code OTP actif pour cette signature")

        if sig_entry.otp_expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Le code OTP a expire")

        if not verify_secret(payload.otp_code, sig_entry.otp_code_hash):
            raise HTTPException(status_code=400, detail="Code OTP invalide")

        sig_entry.otp_verified_at = datetime.utcnow()
        sig_entry.otp_code_hash = None
        sig_entry.otp_expires_at = None
    elif not payload.signature_image:
        raise HTTPException(status_code=400, detail="Une signature dessinee ou importee est obligatoire pour ce document")

    input_path = document.chemin_fichier
    output_path = build_signed_file_path(input_path)

    signature_data = {
        "nom_signataire": payload.nom_visuel,
        "date": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "x": payload.x,
        "y": payload.y,
        "page": payload.page,
        "signature_image": payload.signature_image,
    }

    try:
        PDFService.add_signature_overlay(input_path, output_path, signature_data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la generation du PDF : {str(exc)}") from exc

    sig_entry.etat_signature = "signé"
    sig_entry.date_signature = datetime.now()
    document.chemin_fichier = output_path

    signatures = session.exec(select(Signature).where(Signature.id_document == document.id_document)).all()
    document.statut = "signé" if all(signature.etat_signature == "signé" for signature in signatures) else "en attente"

    session.add(sig_entry)
    session.add(document)
    session.commit()

    status_payload = build_public_signature_status(token, session)

    return {
        "message": "Document signe avec succes",
        "archive_path": output_path,
        "document_status": status_payload.document_status,
        "can_download": status_payload.can_download,
        "completed_signers": status_payload.completed_signers,
        "total_signers": status_payload.total_signers,
        "signature_type": status_payload.signature_type,
    }


@router.get("/download/{token}")
def download_signed_document_by_token(
    token: str,
    session: Session = Depends(get_session),
):
    signature = get_signature_by_token(token, session)

    document = session.get(Document, signature.id_document)
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouve")

    if document.statut != "signé":
        raise HTTPException(status_code=400, detail="Le document n'est pas encore completement signe")

    if not os.path.exists(document.chemin_fichier):
        raise HTTPException(status_code=404, detail="Fichier signe introuvable")

    filename = document.titre if document.titre.lower().endswith(".pdf") else f"{document.titre}.pdf"
    return FileResponse(document.chemin_fichier, media_type="application/pdf", filename=filename)
