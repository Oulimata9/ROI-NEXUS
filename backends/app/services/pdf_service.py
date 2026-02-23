import os
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

class PDFService:
    @staticmethod
    def get_page_count(file_path: str) -> int:
        """Retourne le nombre total de pages d'un document PDF."""
        reader = PdfReader(file_path)
        return len(reader.pages)

    @staticmethod
    def add_signature_overlay(input_pdf_path: str, output_pdf_path: str, signature_data: dict):
        """
        Ajoute une signature visuelle (texte ou image) sur un PDF existant.
        signature_data contient : page, x, y, nom_signataire, date
        """
        reader = PdfReader(input_pdf_path)
        writer = PdfWriter()

        # 1. Créer un "calque" (overlay) avec ReportLab en mémoire
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)
        
        # Positionnement de la signature (coordonnées x, y)
        x = signature_data.get("x", 100)
        y = signature_data.get("y", 100)
        nom = signature_data.get("nom_signataire", "Signataire")
        date_sign = signature_data.get("date", "")

        # Dessiner le texte de signature sur le calque
        can.setFont("Helvetica-Bold", 10)
        can.drawString(x, y, f"Signé par : {nom}")
        can.setFont("Helvetica", 8)
        can.drawString(x, y - 12, f"Le : {date_sign}")
        can.save()

        # 2. Fusionner le calque avec la page cible du PDF original
        packet.seek(0)
        new_pdf = PdfReader(packet)
        target_page_index = signature_data.get("page", 0)

        for i in range(len(reader.pages)):
            page = reader.pages[i]
            if i == target_page_index:
                # On fusionne l'overlay sur la page choisie
                page.merge_page(new_pdf.pages[0])
            writer.add_page(page)

        # 3. Sauvegarder le nouveau fichier signé
        with open(output_pdf_path, "wb") as output_stream:
            writer.write(output_stream)
        
        return output_pdf_path