import hashlib
import hmac
import secrets
import string


def calculate_file_hash(file_content: bytes) -> str:
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_content)
    return sha256_hash.hexdigest()


def generate_secure_token(length: int = 48) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def verify_integrity(current_content: bytes, original_hash: str) -> bool:
    return calculate_file_hash(current_content) == original_hash


def generate_otp(length: int = 6) -> str:
    digits = string.digits
    return ''.join(secrets.choice(digits) for _ in range(length))


def hash_secret(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def verify_secret(value: str, hashed_value: str) -> bool:
    return hmac.compare_digest(hash_secret(value), hashed_value)
