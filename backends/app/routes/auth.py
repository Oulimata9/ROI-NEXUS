from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.database import get_session
from app.models.models import Entreprise, Utilisateur
from app.schemas.entreprise_schema import NexusEntrepriseOut, NexusEntrepriseRegistration
from app.schemas.user_schema import (
    AuthResponse,
    UtilisateurOut,
)
from app.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    require_admin_nexus,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentification"])


@router.post("/signup")
def signup():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="L'inscription publique est desactivee. Un Admin Nexus doit creer le compte entreprise.",
    )


@router.post("/register-company")
def register_company():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="L'inscription publique est desactivee. Connectez-vous avec un compte existant.",
    )


@router.post("/admin/register-company", response_model=NexusEntrepriseOut, status_code=status.HTTP_201_CREATED)
def register_company_by_nexus_admin(
    payload: NexusEntrepriseRegistration,
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(require_admin_nexus),
):
    """
    Cree une entreprise et son administrateur depuis l'espace Admin Nexus.
    """
    _ = current_user
    existing_company = session.exec(
        select(Entreprise).where(
            (Entreprise.nom == payload.nom_entreprise) | (Entreprise.email_contact == payload.email_contact)
        )
    ).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette entreprise ou cet email de contact est deja enregistre.",
        )

    existing_user = session.exec(select(Utilisateur).where(Utilisateur.email == payload.email_admin)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email administrateur est deja enregistre.",
        )

    hashed_pwd = get_password_hash(payload.mot_de_passe)

    company = Entreprise(nom=payload.nom_entreprise, email_contact=payload.email_contact)
    session.add(company)
    session.flush()

    user = Utilisateur(
        nom=payload.nom_admin,
        email=payload.email_admin,
        mot_de_passe=hashed_pwd,
        role="administrateur",
        id_entreprise=company.id_entreprise,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return NexusEntrepriseOut(
        id_entreprise=company.id_entreprise,
        nom_entreprise=company.nom,
        email_contact=company.email_contact,
        statut=company.statut,
        date_creation=company.date_creation,
        admin_id=user.id_utilisateur,
        admin_nom=user.nom,
        admin_email=user.email,
        admin_role=user.role,
    )


@router.post("/login", response_model=AuthResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """
    Verifie les identifiants et retourne un token JWT.
    """
    user = session.exec(select(Utilisateur).where(Utilisateur.email == form_data.username)).first()

    if not user or not verify_password(form_data.password, user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "id_user": user.id_utilisateur,
            "id_entreprise": user.id_entreprise,
            "role": user.role,
        }
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_name=user.nom,
        id_user=user.id_utilisateur,
        id_entreprise=user.id_entreprise,
        role=user.role,
    )


@router.get("/me", response_model=UtilisateurOut)
def get_me(current_user: Utilisateur = Depends(get_current_user)):
    """
    Retourne l'utilisateur authentifie.
    """
    return current_user
