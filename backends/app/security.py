from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session

from app.config import settings
from app.database import get_session
from app.models.models import Utilisateur

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(data: dict) -> str:
    """Genere un jeton JWT signe."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def ensure_enterprise_scope(requested_enterprise_id: Optional[int], current_user: Utilisateur) -> None:
    if requested_enterprise_id is not None and requested_enterprise_id != current_user.id_entreprise:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse pour cette entreprise")


def ensure_user_scope(requested_user_id: Optional[int], current_user: Utilisateur) -> None:
    if requested_user_id is not None and requested_user_id != current_user.id_utilisateur:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse pour cet utilisateur")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Utilisateur:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentification invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("id_user")
        email = payload.get("sub")
        if user_id is None or email is None:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = session.get(Utilisateur, user_id)
    if not user or user.email != email:
        raise credentials_exception

    return user


def require_roles(*allowed_roles: str):
    def dependency(current_user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acces reserve a ce profil.",
            )
        return current_user

    return dependency


def require_admin_nexus(current_user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
    if current_user.role != "admin_nexus":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acces reserve a l'Admin Nexus.",
        )
    return current_user
