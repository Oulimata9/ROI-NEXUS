from pydantic import BaseModel


class ZoneIn(BaseModel):
    email_signataire: str
    page: int = 1
    x: float
    y: float
    largeur: float = 22.0
    hauteur: float = 8.0


class ZoneUpdate(BaseModel):
    x: float
    y: float
    largeur: float
    hauteur: float


class ZoneOut(BaseModel):
    id_zone: int
    id_document: int
    email_signataire: str
    page: int
    x: float
    y: float
    largeur: float
    hauteur: float
    verrouille: bool

    class Config:
        from_attributes = True
