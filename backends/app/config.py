import os
from dataclasses import dataclass


def parse_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def parse_csv(value: str | None, default: list[str]) -> list[str]:
    if value is None:
        return default

    items = [item.strip() for item in value.split(",") if item.strip()]
    return items or default


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_description: str
    app_version: str
    environment: str
    database_url: str
    database_echo: bool
    secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    cors_allow_origins: list[str]
    cors_allow_credentials: bool
    cors_allow_methods: list[str]
    cors_allow_headers: list[str]
    upload_dir: str
    auto_create_tables: bool
    frontend_base_url: str
    smtp_enabled: bool
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    smtp_from_email: str
    smtp_from_name: str
    smtp_use_tls: bool
    nexus_admin_name: str
    nexus_admin_email: str
    nexus_admin_password: str
    nexus_admin_company_name: str
    nexus_admin_company_email: str

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


def build_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    host = os.getenv("DATABASE_HOST", "db")
    port = os.getenv("DATABASE_PORT", "5432").split()[0]
    database = os.getenv("POSTGRES_DB", "roi_nexus")
    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"


settings = Settings(
    app_name=os.getenv("APP_NAME", "ROI NEXUS - API de Signature Electronique"),
    app_description=os.getenv("APP_DESCRIPTION", "Backend securise pour l'Afrique"),
    app_version=os.getenv("APP_VERSION", "1.0.0"),
    environment=os.getenv("ENVIRONMENT", "development"),
    database_url=build_database_url(),
    database_echo=parse_bool(os.getenv("DATABASE_ECHO"), False),
    secret_key=os.getenv("SECRET_KEY", "change_me"),
    jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
    access_token_expire_minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")),
    cors_allow_origins=parse_csv(
        os.getenv("CORS_ALLOW_ORIGINS"),
        ["http://localhost:3000", "http://127.0.0.1:3000"],
    ),
    cors_allow_credentials=parse_bool(os.getenv("CORS_ALLOW_CREDENTIALS"), True),
    cors_allow_methods=parse_csv(
        os.getenv("CORS_ALLOW_METHODS"),
        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    ),
    cors_allow_headers=parse_csv(
        os.getenv("CORS_ALLOW_HEADERS"),
        ["Authorization", "Content-Type"],
    ),
    upload_dir=os.getenv("UPLOAD_DIR", "uploads"),
    auto_create_tables=parse_bool(os.getenv("AUTO_CREATE_TABLES"), False),
    frontend_base_url=os.getenv("FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/"),
    smtp_enabled=parse_bool(os.getenv("SMTP_ENABLED"), False),
    smtp_host=os.getenv("SMTP_HOST", ""),
    smtp_port=int(os.getenv("SMTP_PORT", "587")),
    smtp_username=os.getenv("SMTP_USERNAME", ""),
    smtp_password=os.getenv("SMTP_PASSWORD", ""),
    smtp_from_email=os.getenv("SMTP_FROM_EMAIL", "no-reply@nexussign.local"),
    smtp_from_name=os.getenv("SMTP_FROM_NAME", "Nexus Sign"),
    smtp_use_tls=parse_bool(os.getenv("SMTP_USE_TLS"), True),
    nexus_admin_name=os.getenv("NEXUS_ADMIN_NAME", "Admin Nexus"),
    nexus_admin_email=os.getenv("NEXUS_ADMIN_EMAIL", ""),
    nexus_admin_password=os.getenv("NEXUS_ADMIN_PASSWORD", ""),
    nexus_admin_company_name=os.getenv("NEXUS_ADMIN_COMPANY_NAME", "Nexus Sign"),
    nexus_admin_company_email=os.getenv("NEXUS_ADMIN_COMPANY_EMAIL", "admin@nexussign.local"),
)


def validate_runtime_configuration() -> None:
    if settings.is_production and settings.secret_key == "change_me":
        raise RuntimeError("SECRET_KEY doit etre personnalisee en production.")

    if settings.is_production and settings.cors_allow_origins == ["*"]:
        raise RuntimeError("CORS_ALLOW_ORIGINS ne peut pas etre '*' en production.")

    if settings.smtp_enabled and not settings.smtp_host:
        raise RuntimeError("SMTP_HOST est obligatoire lorsque SMTP_ENABLED=true.")
