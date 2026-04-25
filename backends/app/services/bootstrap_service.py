from sqlalchemy import inspect, text
from sqlmodel import Session, select

from app.config import settings
from app.database import engine
from app.models.models import Entreprise, Utilisateur
from app.security import get_password_hash


def sync_postgres_sequences() -> None:
    if not settings.database_url.startswith("postgresql"):
        return

    inspector = inspect(engine)
    managed_tables = [
        ("entreprise", "id_entreprise"),
        ("utilisateur", "id_utilisateur"),
        ("document", "id_document"),
        ("signature", "id_signature"),
    ]

    with engine.begin() as connection:
        for table_name, column_name in managed_tables:
            if not inspector.has_table(table_name):
                continue

            connection.execute(
                text(
                    f"""
                    SELECT setval(
                        pg_get_serial_sequence('{table_name}', '{column_name}'),
                        COALESCE(MAX({column_name}), 1),
                        MAX({column_name}) IS NOT NULL
                    )
                    FROM {table_name}
                    """
                )
            )


def ensure_nexus_admin_account() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("entreprise") or not inspector.has_table("utilisateur"):
        return

    if not settings.nexus_admin_email or not settings.nexus_admin_password:
        return

    with Session(engine) as session:
        company = session.exec(
            select(Entreprise).where(Entreprise.email_contact == settings.nexus_admin_company_email)
        ).first()

        if not company:
            company = session.exec(
                select(Entreprise).where(Entreprise.nom == settings.nexus_admin_company_name)
            ).first()

        if not company:
            company = Entreprise(
                nom=settings.nexus_admin_company_name,
                email_contact=settings.nexus_admin_company_email,
                statut="actif",
            )
            session.add(company)
            session.flush()

        existing_admin = session.exec(
            select(Utilisateur).where(Utilisateur.email == settings.nexus_admin_email)
        ).first()

        if existing_admin:
            existing_admin.nom = settings.nexus_admin_name
            existing_admin.mot_de_passe = get_password_hash(settings.nexus_admin_password)
            existing_admin.role = "admin_nexus"
            existing_admin.id_entreprise = company.id_entreprise
            session.add(existing_admin)
        else:
            admin_user = Utilisateur(
                nom=settings.nexus_admin_name,
                email=settings.nexus_admin_email,
                mot_de_passe=get_password_hash(settings.nexus_admin_password),
                role="admin_nexus",
                id_entreprise=company.id_entreprise,
            )
            session.add(admin_user)

        session.commit()
