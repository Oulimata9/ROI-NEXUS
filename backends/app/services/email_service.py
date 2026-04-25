import smtplib
from dataclasses import asdict, dataclass
from email.message import EmailMessage

from app.config import settings


@dataclass(frozen=True)
class EmailSendResult:
    enabled: bool
    sent: bool
    message: str

    def to_dict(self) -> dict:
        return asdict(self)


def build_signature_link(token: str) -> str:
    return f"{settings.frontend_base_url}/sign/{token}"


def send_email(to_email: str, subject: str, text_body: str, html_body: str | None = None) -> EmailSendResult:
    if not settings.smtp_enabled:
        return EmailSendResult(enabled=False, sent=False, message="SMTP disabled")

    if not settings.smtp_host:
        return EmailSendResult(enabled=True, sent=False, message="SMTP host missing")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = to_email
    message.set_content(text_body)

    if html_body:
        message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()

            if settings.smtp_username:
                smtp.login(settings.smtp_username, settings.smtp_password)

            smtp.send_message(message)
    except Exception as exc:
        return EmailSendResult(enabled=True, sent=False, message=f"SMTP send failed: {str(exc)}")

    return EmailSendResult(enabled=True, sent=True, message="Email sent")


def send_signature_invitation(to_email: str, document_title: str, token: str) -> EmailSendResult:
    link = build_signature_link(token)
    subject = f"Invitation a signer: {document_title}"
    text_body = (
        f"Bonjour,\n\n"
        f"Vous avez recu une invitation pour signer le document '{document_title}'.\n"
        f"Utilisez ce lien securise pour acceder a la signature:\n{link}\n\n"
        f"Equipe Nexus Sign"
    )
    html_body = (
        "<p>Bonjour,</p>"
        f"<p>Vous avez recu une invitation pour signer le document <strong>{document_title}</strong>.</p>"
        f"<p><a href=\"{link}\">Ouvrir le lien de signature securise</a></p>"
        "<p>Equipe Nexus Sign</p>"
    )
    return send_email(to_email, subject, text_body, html_body)


def send_signature_reminder(to_email: str, document_title: str, token: str) -> EmailSendResult:
    link = build_signature_link(token)
    subject = f"Rappel de signature: {document_title}"
    text_body = (
        f"Bonjour,\n\n"
        f"Un document '{document_title}' attend toujours votre signature.\n"
        f"Vous pouvez le consulter et signer ici:\n{link}\n\n"
        f"Equipe Nexus Sign"
    )
    html_body = (
        "<p>Bonjour,</p>"
        f"<p>Le document <strong>{document_title}</strong> attend toujours votre signature.</p>"
        f"<p><a href=\"{link}\">Acceder au document a signer</a></p>"
        "<p>Equipe Nexus Sign</p>"
    )
    return send_email(to_email, subject, text_body, html_body)


def send_signature_otp(to_email: str, document_title: str, otp_code: str) -> EmailSendResult:
    subject = f"Code OTP de signature: {document_title}"
    text_body = (
        f"Bonjour,\n\n"
        f"Votre code OTP pour signer le document '{document_title}' est : {otp_code}\n"
        f"Ce code expire dans 10 minutes.\n\n"
        f"Equipe Nexus Sign"
    )
    html_body = (
        "<p>Bonjour,</p>"
        f"<p>Votre code OTP pour signer le document <strong>{document_title}</strong> est :</p>"
        f"<p style=\"font-size: 28px; font-weight: 700; letter-spacing: 4px;\">{otp_code}</p>"
        "<p>Ce code expire dans 10 minutes.</p>"
        "<p>Equipe Nexus Sign</p>"
    )
    return send_email(to_email, subject, text_body, html_body)
