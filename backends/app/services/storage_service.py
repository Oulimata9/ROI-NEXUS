import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def save_upload_file(upload_file: UploadFile) -> str:
    dest = os.path.join(UPLOAD_DIR, upload_file.filename)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return dest