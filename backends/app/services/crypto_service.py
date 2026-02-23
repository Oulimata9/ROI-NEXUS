import hashlib
import secrets
import string

def calculate_file_hash(file_content: bytes) -> str:
    """
    Calcule l'empreinte numérique (SHA-256) du document.
    Cette preuve permet de vérifier que le document n'a pas été altéré. [cite: 144, 168]
    """
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_content)
    return sha256_hash.hexdigest()

def generate_secure_token(length: int = 48) -> str:
    """
    Génère un jeton unique et hautement sécurisé pour les signataires externes.
    Conformément à votre vision, cela permet de signer sans compte utilisateur. [cite: 119, 188]
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def verify_integrity(current_content: bytes, original_hash: str) -> bool:
    """
    Vérifie si le document actuel correspond toujours à l'original. [cite: 140]
    """
    return calculate_file_hash(current_content) == original_hash