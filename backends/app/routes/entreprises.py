from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models.models import Entreprise, Utilisateur
from app.schemas.entreprise_schema import NexusEntrepriseOut
from app.security import require_admin_nexus

router = APIRouter(prefix="/entreprises", tags=["Entreprises"])


def build_company_overview(entreprise: Entreprise, admin_user: Utilisateur) -> NexusEntrepriseOut:
    return NexusEntrepriseOut(
        id_entreprise=entreprise.id_entreprise,
        nom_entreprise=entreprise.nom,
        email_contact=entreprise.email_contact,
        statut=entreprise.statut,
        date_creation=entreprise.date_creation,
        admin_id=admin_user.id_utilisateur,
        admin_nom=admin_user.nom,
        admin_email=admin_user.email,
        admin_role=admin_user.role,
    )


@router.get("/admin", response_model=List[NexusEntrepriseOut])
def list_entreprises_for_nexus_admin(
    session: Session = Depends(get_session),
    current_user: Utilisateur = Depends(require_admin_nexus),
):
    _ = current_user
    entreprises = session.exec(select(Entreprise).order_by(Entreprise.date_creation.desc())).all()
    companies: list[NexusEntrepriseOut] = []

    for entreprise in entreprises:
        users = session.exec(
            select(Utilisateur).where(Utilisateur.id_entreprise == entreprise.id_entreprise)
        ).all()

        if not users:
            continue

        admin_user = next((user for user in users if user.role == "administrateur"), None)
        if admin_user is None:
            admin_user = users[0]

        if admin_user.role == "admin_nexus":
            continue

        companies.append(build_company_overview(entreprise, admin_user))

    return companies
