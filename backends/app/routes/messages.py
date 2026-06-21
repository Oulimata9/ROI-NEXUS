from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from sqlmodel import Session, select

from app.config import settings
from app.database import engine, get_session
from app.models.models import Entreprise, Message, Utilisateur
from app.security import get_current_user, require_admin_nexus
from app.services.ws_manager import manager

router = APIRouter(tags=["Messages"])


def _decode_ws_user(token: str) -> Utilisateur | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("id_user")
        email = payload.get("sub")
        if not user_id or not email:
            return None
        with Session(engine) as session:
            user = session.get(Utilisateur, user_id)
            if not user or user.email != email:
                return None
            return user
    except JWTError:
        return None


def _message_dict(m: Message) -> dict:
    return {
        "id_message": m.id_message,
        "contenu": m.contenu,
        "date_envoi": m.date_envoi.isoformat(),
        "lu": m.lu,
        "expediteur_role": m.expediteur_role,
        "id_expediteur": m.id_expediteur,
        "id_entreprise": m.id_entreprise,
    }


@router.get("/messages/nexus/conversations")
def get_conversations(
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(require_admin_nexus),
):
    """Admin Nexus : liste toutes les conversations avec les entreprises."""
    _ = current_user
    entreprises = session.exec(select(Entreprise)).all()
    result = []
    for ent in entreprises:
        msgs = session.exec(
            select(Message)
            .where(Message.id_entreprise == ent.id_entreprise)
            .order_by(Message.date_envoi.desc())
        ).all()
        if not msgs:
            continue
        last = msgs[0]
        unread = sum(1 for m in msgs if not m.lu and m.expediteur_role != "admin_nexus")
        result.append({
            "id_entreprise": ent.id_entreprise,
            "nom_entreprise": ent.nom,
            "last_message": last.contenu,
            "last_message_date": last.date_envoi.isoformat(),
            "last_message_role": last.expediteur_role,
            "unread_count": unread,
        })
    result.sort(key=lambda x: x["last_message_date"], reverse=True)
    return result


@router.get("/messages/{id_entreprise}")
def get_messages(
    id_entreprise: int,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Historique des messages d'une conversation."""
    if current_user.role != "admin_nexus" and current_user.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Acces refuse")

    msgs = session.exec(
        select(Message)
        .where(Message.id_entreprise == id_entreprise)
        .order_by(Message.date_envoi.asc())
    ).all()
    return [_message_dict(m) for m in msgs]


@router.patch("/messages/{id_entreprise}/read")
def mark_read(
    id_entreprise: int,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Marque comme lus les messages de l'autre partie."""
    if current_user.role != "admin_nexus" and current_user.id_entreprise != id_entreprise:
        raise HTTPException(status_code=403, detail="Acces refuse")

    other_role = "administrateur" if current_user.role == "admin_nexus" else "admin_nexus"
    msgs = session.exec(
        select(Message).where(
            Message.id_entreprise == id_entreprise,
            Message.expediteur_role == other_role,
            Message.lu == False,  # noqa: E712
        )
    ).all()
    now = datetime.utcnow()
    for m in msgs:
        m.lu = True
        m.date_lecture = now
        session.add(m)
    session.commit()
    return {"marked_read": len(msgs)}


@router.websocket("/ws/messages/{id_entreprise}")
async def websocket_messages(
    websocket: WebSocket,
    id_entreprise: int,
    token: str = Query(...),
):
    user = _decode_ws_user(token)
    if not user:
        await websocket.close(code=4001)
        return

    if user.role != "admin_nexus" and user.id_entreprise != id_entreprise:
        await websocket.close(code=4003)
        return

    await manager.connect(websocket, id_entreprise)
    try:
        while True:
            data = await websocket.receive_json()
            contenu = (data.get("contenu") or "").strip()
            if not contenu:
                continue

            with Session(engine) as session:
                msg = Message(
                    contenu=contenu,
                    expediteur_role=user.role,
                    id_expediteur=user.id_utilisateur,
                    id_entreprise=id_entreprise,
                )
                session.add(msg)
                session.commit()
                session.refresh(msg)
                payload = _message_dict(msg)

            await manager.broadcast(payload, id_entreprise)

    except WebSocketDisconnect:
        manager.disconnect(websocket, id_entreprise)
