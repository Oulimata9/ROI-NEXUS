from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SignatureValidationIn(BaseModel):
    nom_visuel: str
    x: int = 100
    y: int = 150
    page: int = 0
    otp_code: Optional[str] = None
    signature_image: Optional[str] = None


class PublicSignatureStatusOut(BaseModel):
    token: str
    document_id: int
    document_title: str
    document_status: str
    document_created_at: datetime
    document_sent_at: Optional[datetime]
    current_signer_email: str
    current_signature_status: str
    current_signature_date: Optional[datetime]
    signature_type: str
    otp_required: bool
    otp_verified: bool
    otp_expires_at: Optional[datetime]
    total_signers: int
    completed_signers: int
    can_sign: bool
    can_download: bool
