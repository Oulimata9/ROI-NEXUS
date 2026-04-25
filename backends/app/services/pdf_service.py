import base64
import io

from pypdf import PdfReader, PdfWriter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


class PDFService:
    @staticmethod
    def get_page_count(file_path: str) -> int:
        """Retourne le nombre total de pages d'un document PDF."""
        reader = PdfReader(file_path)
        return len(reader.pages)

    @staticmethod
    def _decode_signature_image(signature_image: str) -> bytes:
        if not signature_image:
            raise ValueError("Image de signature manquante")

        encoded_payload = signature_image.split(",", 1)[1] if "," in signature_image else signature_image
        try:
            return base64.b64decode(encoded_payload, validate=True)
        except Exception as exc:
            raise ValueError("Image de signature invalide") from exc

    @staticmethod
    def _build_overlay(page_width: float, page_height: float, signature_data: dict) -> PdfReader:
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))

        x = signature_data.get("x", 100)
        y = signature_data.get("y", 100)
        nom = signature_data.get("nom_signataire", "Signataire")
        date_sign = signature_data.get("date", "")
        signature_image = signature_data.get("signature_image")

        if signature_image:
            image_bytes = PDFService._decode_signature_image(signature_image)
            image_reader = ImageReader(io.BytesIO(image_bytes))
            can.drawImage(
                image_reader,
                x,
                y,
                width=180,
                height=60,
                mask="auto",
                preserveAspectRatio=True,
                anchor="sw",
            )
            can.setFont("Helvetica-Bold", 9)
            can.drawString(x, y - 14, f"Signe par : {nom}")
            can.setFont("Helvetica", 8)
            can.drawString(x, y - 26, f"Le : {date_sign}")
        else:
            can.setFont("Helvetica-Bold", 10)
            can.drawString(x, y, f"Signe par : {nom}")
            can.setFont("Helvetica", 8)
            can.drawString(x, y - 12, f"Le : {date_sign}")

        can.save()
        packet.seek(0)
        return PdfReader(packet)

    @staticmethod
    def add_signature_overlay(input_pdf_path: str, output_pdf_path: str, signature_data: dict):
        """
        Ajoute une signature visuelle (texte ou image) sur un PDF existant.
        signature_data contient : page, x, y, nom_signataire, date, signature_image
        """
        reader = PdfReader(input_pdf_path)
        writer = PdfWriter()

        target_page_index = signature_data.get("page", 0)
        if target_page_index < 0 or target_page_index >= len(reader.pages):
            raise ValueError("Page de signature invalide")

        target_page = reader.pages[target_page_index]
        page_width = float(target_page.mediabox.width)
        page_height = float(target_page.mediabox.height)
        overlay_pdf = PDFService._build_overlay(page_width, page_height, signature_data)

        for index, page in enumerate(reader.pages):
            if index == target_page_index:
                page.merge_page(overlay_pdf.pages[0])
            writer.add_page(page)

        with open(output_pdf_path, "wb") as output_stream:
            writer.write(output_stream)

        return output_pdf_path
