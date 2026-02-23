from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentOut(BaseModel):
    id_document: int
    titre: str
    statut: str
    date_creation: datetime
    id_createur: int

    class Config:
        from_attributes = True