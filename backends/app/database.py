from sqlmodel import SQLModel, Session, create_engine

from app.config import settings

engine = create_engine(settings.database_url, echo=settings.database_echo)


def create_db_and_tables():
    from app.models.models import Document, Entreprise, Signature, Utilisateur

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
