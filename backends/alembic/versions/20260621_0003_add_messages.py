"""Add messages table

Revision ID: 20260621_0003
Revises: 20260422_0002
Create Date: 2026-06-21 10:00:00
"""

import sqlalchemy as sa
from alembic import op

revision = "20260621_0003"
down_revision = "20260422_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "message",
        sa.Column("id_message", sa.Integer(), nullable=False),
        sa.Column("contenu", sa.String(), nullable=False),
        sa.Column("date_envoi", sa.DateTime(), nullable=False),
        sa.Column("lu", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("date_lecture", sa.DateTime(), nullable=True),
        sa.Column("expediteur_role", sa.String(), nullable=False),
        sa.Column("id_expediteur", sa.Integer(), nullable=False),
        sa.Column("id_entreprise", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["id_expediteur"], ["utilisateur.id_utilisateur"]),
        sa.ForeignKeyConstraint(["id_entreprise"], ["entreprise.id_entreprise"]),
        sa.PrimaryKeyConstraint("id_message"),
    )
    op.create_index("ix_message_id_entreprise", "message", ["id_entreprise"])


def downgrade() -> None:
    op.drop_index("ix_message_id_entreprise", table_name="message")
    op.drop_table("message")
