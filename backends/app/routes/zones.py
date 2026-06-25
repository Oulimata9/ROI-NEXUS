from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.models import Document, Signature, ZoneSignature
from app.schemas.zone_schema import ZoneIn, ZoneOut, ZoneUpdate
from app.security import get_current_user

router = APIRouter(tags=["Zones"])


def _get_document_owned(id_document: int, session: Session, current_user) -> Document:
    doc = session.get(Document, id_document)
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouve")
    if doc.id_entreprise != current_user.id_entreprise:
        raise HTTPException(status_code=403, detail="Acces refuse")
    return doc


def _require_creator(doc: Document, current_user) -> None:
    if doc.id_createur != current_user.id_utilisateur:
        raise HTTPException(status_code=403, detail="Seul le createur peut gerer les zones de signature")


@router.get("/documents/{id_document}/zones", response_model=List[ZoneOut])
def list_zones(
    id_document: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    _get_document_owned(id_document, session, current_user)
    return session.exec(
        select(ZoneSignature).where(ZoneSignature.id_document == id_document)
    ).all()


@router.post("/documents/{id_document}/zones", response_model=ZoneOut, status_code=status.HTTP_201_CREATED)
def create_zone(
    id_document: int,
    zone: ZoneIn,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    doc = _get_document_owned(id_document, session, current_user)
    _require_creator(doc, current_user)

    if doc.statut in {"signé", "archivé"}:
        raise HTTPException(status_code=400, detail="Impossible d'ajouter une zone sur un document finalise")

    new_zone = ZoneSignature(id_document=id_document, **zone.dict())
    session.add(new_zone)
    session.commit()
    session.refresh(new_zone)
    return new_zone


@router.put("/zones/{id_zone}", response_model=ZoneOut)
def update_zone(
    id_zone: int,
    data: ZoneUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    zone = session.get(ZoneSignature, id_zone)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone non trouvee")

    doc = _get_document_owned(zone.id_document, session, current_user)
    _require_creator(doc, current_user)

    if zone.verrouille:
        raise HTTPException(status_code=400, detail="Zone verrouilee, impossible de modifier")

    for field, value in data.dict().items():
        setattr(zone, field, value)

    session.add(zone)
    session.commit()
    session.refresh(zone)
    return zone


@router.delete("/zones/{id_zone}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zone(
    id_zone: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    zone = session.get(ZoneSignature, id_zone)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone non trouvee")

    doc = _get_document_owned(zone.id_document, session, current_user)
    _require_creator(doc, current_user)

    if zone.verrouille:
        raise HTTPException(status_code=400, detail="Zone verrouilee, impossible de supprimer")

    session.delete(zone)
    session.commit()


@router.patch("/documents/{id_document}/zones/lock")
def lock_zones(
    id_document: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    """Verrouille toutes les zones apres l'envoi du document."""
    _get_document_owned(id_document, session, current_user)
    zones = session.exec(
        select(ZoneSignature).where(ZoneSignature.id_document == id_document)
    ).all()
    for zone in zones:
        zone.verrouille = True
        session.add(zone)
    session.commit()
    return {"locked": len(zones)}


@router.get("/signatures/public/{token}/zones", response_model=List[ZoneOut])
def get_public_zones_for_signer(
    token: str,
    session: Session = Depends(get_session),
):
    """Retourne les zones de signature pour un signataire (acces public via token)."""
    sig = session.exec(select(Signature).where(Signature.token_acces == token)).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Token de signature invalide")

    zones = session.exec(
        select(ZoneSignature).where(
            ZoneSignature.id_document == sig.id_document,
            ZoneSignature.email_signataire == sig.email_signataire,
        )
    ).all()
    return zones
