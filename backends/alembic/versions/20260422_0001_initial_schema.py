"""Initial schema

Revision ID: 20260422_0001
Revises: None
Create Date: 2026-04-22 02:10:00
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "entreprise",
        sa.Column("id_entreprise", sa.Integer(), nullable=False),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("date_creation", sa.DateTime(), nullable=False),
        sa.Column("statut", sa.String(), nullable=False),
        sa.Column("email_contact", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id_entreprise"),
        sa.UniqueConstraint("email_contact"),
    )
    op.create_index("ix_entreprise_nom", "entreprise", ["nom"], unique=False)

    op.create_table(
        "utilisateur",
        sa.Column("id_utilisateur", sa.Integer(), nullable=False),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("mot_de_passe", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("date_creation", sa.DateTime(), nullable=False),
        sa.Column("id_entreprise", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id_entreprise"], ["entreprise.id_entreprise"]),
        sa.PrimaryKeyConstraint("id_utilisateur"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_utilisateur_email", "utilisateur", ["email"], unique=False)

    op.create_table(
        "document",
        sa.Column("id_document", sa.Integer(), nullable=False),
        sa.Column("titre", sa.String(), nullable=False),
        sa.Column("statut", sa.String(), nullable=False),
        sa.Column("date_creation", sa.DateTime(), nullable=False),
        sa.Column("date_envoi", sa.DateTime(), nullable=True),
        sa.Column("chemin_fichier", sa.String(), nullable=False),
        sa.Column("hash_original", sa.String(), nullable=False),
        sa.Column("id_entreprise", sa.Integer(), nullable=False),
        sa.Column("id_createur", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id_createur"], ["utilisateur.id_utilisateur"]),
        sa.ForeignKeyConstraint(["id_entreprise"], ["entreprise.id_entreprise"]),
        sa.PrimaryKeyConstraint("id_document"),
    )

    op.create_table(
        "signature",
        sa.Column("id_signature", sa.Integer(), nullable=False),
        sa.Column("date_signature", sa.DateTime(), nullable=True),
        sa.Column("email_signataire", sa.String(), nullable=False),
        sa.Column("etat_signature", sa.String(), nullable=False),
        sa.Column("token_acces", sa.String(), nullable=False),
        sa.Column("id_document", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id_document"], ["document.id_document"]),
        sa.PrimaryKeyConstraint("id_signature"),
        sa.UniqueConstraint("token_acces"),
    )


def downgrade() -> None:
    op.drop_table("signature")
    op.drop_table("document")
    op.drop_index("ix_utilisateur_email", table_name="utilisateur")
    op.drop_table("utilisateur")
    op.drop_index("ix_entreprise_nom", table_name="entreprise")
    op.drop_table("entreprise")
