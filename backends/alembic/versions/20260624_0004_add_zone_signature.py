"""Add zone_signature table

Revision ID: 20260624_0004
Revises: 20260621_0003
Create Date: 2026-06-24 10:00:00
"""

import sqlalchemy as sa
from alembic import op

revision = "20260624_0004"
down_revision = "20260621_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "zone_signature",
        sa.Column("id_zone", sa.Integer(), nullable=False),
        sa.Column("id_document", sa.Integer(), nullable=False),
        sa.Column("email_signataire", sa.String(), nullable=False),
        sa.Column("page", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("x", sa.Float(), nullable=False, server_default="10.0"),
        sa.Column("y", sa.Float(), nullable=False, server_default="10.0"),
        sa.Column("largeur", sa.Float(), nullable=False, server_default="22.0"),
        sa.Column("hauteur", sa.Float(), nullable=False, server_default="8.0"),
        sa.Column("verrouille", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.ForeignKeyConstraint(["id_document"], ["document.id_document"]),
        sa.PrimaryKeyConstraint("id_zone"),
    )
    op.create_index("ix_zone_signature_id_document", "zone_signature", ["id_document"])


def downgrade() -> None:
    op.drop_index("ix_zone_signature_id_document", table_name="zone_signature")
    op.drop_table("zone_signature")
