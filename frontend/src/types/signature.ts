export interface PublicSignatureStatus {
  token: string;
  document_id: number;
  document_title: string;
  document_status: string;
  document_created_at: string;
  document_sent_at?: string | null;
  current_signer_email: string;
  current_signature_status: string;
  current_signature_date?: string | null;
  signature_type: 'draw' | 'numerique_otp';
  otp_required: boolean;
  otp_verified: boolean;
  otp_expires_at?: string | null;
  total_signers: number;
  completed_signers: number;
  can_sign: boolean;
  can_download: boolean;
}
