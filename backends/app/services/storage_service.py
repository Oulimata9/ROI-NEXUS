import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.config import settings

UPLOAD_ROOT = Path(settings.upload_dir)
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)


def ensure_company_upload_dir(company_id: int) -> Path:
    company_dir = UPLOAD_ROOT / f"entreprise_{company_id}"
    company_dir.mkdir(parents=True, exist_ok=True)
    return company_dir


def build_signed_file_path(source_path: str) -> str:
    source = Path(source_path)
    base_stem = source.stem.split("_signed")[0]
    return str(source.with_name(f"{base_stem}_signed_{uuid4().hex[:8]}{source.suffix}"))


def save_upload_file(upload_file: UploadFile, company_id: int) -> str:
    company_dir = ensure_company_upload_dir(company_id)
    suffix = Path(upload_file.filename or "document.pdf").suffix.lower() or ".pdf"
    destination = company_dir / f"{uuid4().hex}{suffix}"

    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return str(destination)
