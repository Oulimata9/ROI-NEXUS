"""Add signature type and otp fields

Revision ID: 20260422_0002
Revises: 20260422_0001
Create Date: 2026-04-22 15:05:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260422_0002"
down_revision = "20260422_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("signature", sa.Column("type_signature", sa.String(), nullable=False, server_default="draw"))
    op.add_column("signature", sa.Column("otp_requis", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("signature", sa.Column("otp_code_hash", sa.String(), nullable=True))
    op.add_column("signature", sa.Column("otp_expires_at", sa.DateTime(), nullable=True))
    op.add_column("signature", sa.Column("otp_verified_at", sa.DateTime(), nullable=True))
    op.add_column("signature", sa.Column("otp_last_sent_at", sa.DateTime(), nullable=True))

    op.alter_column("signature", "type_signature", server_default=None)
    op.alter_column("signature", "otp_requis", server_default=None)


def downgrade() -> None:
    op.drop_column("signature", "otp_last_sent_at")
    op.drop_column("signature", "otp_verified_at")
    op.drop_column("signature", "otp_expires_at")
    op.drop_column("signature", "otp_code_hash")
    op.drop_column("signature", "otp_requis")
    op.drop_column("signature", "type_signature")
