from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings, validate_runtime_configuration
from app.database import create_db_and_tables
from app.routes import auth, documents, entreprises, signatures
from app.services.bootstrap_service import ensure_nexus_admin_account, sync_postgres_sequences

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


@app.on_event("startup")
def on_startup():
    validate_runtime_configuration()
    if settings.auto_create_tables:
        create_db_and_tables()
    sync_postgres_sequences()
    ensure_nexus_admin_account()


@app.get("/", tags=["Initialisation"])
async def root():
    return {
        "message": "Bienvenue sur l'API Nexus Sign",
        "statut": "Operationnel",
        "environment": settings.environment,
    }


app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(signatures.router)
app.include_router(entreprises.router)
