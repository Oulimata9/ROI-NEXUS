import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2, Mail, Shield } from 'lucide-react';

import api from '../../api/axios';
import Logo from '../../components/roi-nexus/Logo';
import SignatureModal from '../../components/roi-nexus/SignatureModal';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import type { PublicSignatureStatus } from '../../types/signature';

interface Document {
  id: string;
  name: string;
  status: string;
  date: string;
  signers: string[];
}

interface SignaturePageProps {
  document: Document | null;
  token: string;
  onNavigate: (page: 'landing' | 'signature-confirmation') => void;
}

export default function SignaturePage({ document, token, onNavigate }: SignaturePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signature, setSignature] = useState<{ data: string; type: 'draw' | 'type' | 'upload' } | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [publicStatus, setPublicStatus] = useState<PublicSignatureStatus | null>(null);
  const [typedSignerName, setTypedSignerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPublicStatus = async () => {
      if (!token) {
        setError("Impossible de charger le document sans lien securise.");
        setIsLoadingDocument(false);
        return;
      }

      setIsLoadingDocument(true);

      try {
        const response = await api.get<PublicSignatureStatus>(`/signatures/public/${token}`);
        if (!isMounted) {
          return;
        }

        setPublicStatus(response.data);
        setTypedSignerName(response.data.current_signer_email.split('@')[0] || '');
        setError('');
      } catch (err: any) {
        if (!isMounted) {
          return;
        }

        setError(err.response?.data?.detail || "Impossible de charger le document a signer.");
      } finally {
        if (isMounted) {
          setIsLoadingDocument(false);
        }
      }
    };

    void loadPublicStatus();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSaveSignature = (signatureData: string, type: 'draw' | 'type' | 'upload') => {
    setSignature({ data: signatureData, type });
    setIsModalOpen(false);
    setError('');
  };

  const isOtpSignature = publicStatus?.signature_type === 'numerique_otp';

  const handleSendOtp = async () => {
    if (!token) {
      setError("Impossible d'envoyer un OTP sans lien securise.");
      return;
    }

    setIsSendingOtp(true);
    setError('');
    setOtpFeedback('');

    try {
      const response = await api.post(`/signatures/otp/send/${token}`);
      const expiresAt = response.data?.expires_at ? new Date(response.data.expires_at).toLocaleTimeString('fr-FR') : null;
      setOtpFeedback(expiresAt ? `Code OTP envoye. Expiration a ${expiresAt}.` : 'Code OTP envoye.');
      setOtpPreview(response.data?.otp_preview || null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Impossible d'envoyer le code OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSign = async () => {
    if (!token) {
      setError("Impossible de signer le document sans lien securise.");
      return;
    }

    if (publicStatus && !publicStatus.can_sign) {
      setError("Cette signature a deja ete traitee ou le document n'accepte plus de nouvelles signatures.");
      return;
    }

    if (isOtpSignature) {
      if (!typedSignerName.trim()) {
        setError("Veuillez saisir le nom du signataire pour la signature numerique.");
        return;
      }

      if (!otpCode.trim()) {
        setError("Veuillez saisir le code OTP pour finaliser la signature numerique.");
        return;
      }
    } else if (!signature) {
      setError("Veuillez creer une signature par dessin avant de confirmer.");
      return;
    }

    setIsSigning(true);
    setError('');

    try {
      const response = await api.post(`/signatures/sign/${token}`, {
        nom_visuel: isOtpSignature ? typedSignerName.trim() : (typedSignerName.trim() || signerEmail.split('@')[0] || 'Signataire'),
        x: 100,
        y: 150,
        page: 0,
        otp_code: isOtpSignature ? otpCode.trim() : null,
        signature_image: !isOtpSignature && signature ? signature.data : null,
      });

      setPublicStatus((previousStatus) => (
        previousStatus
          ? {
              ...previousStatus,
              current_signature_status: 'signé',
              current_signature_date: new Date().toISOString(),
              can_sign: false,
              can_download: response.data?.can_download ?? previousStatus.can_download,
              document_status: response.data?.document_status ?? previousStatus.document_status,
              completed_signers: response.data?.completed_signers ?? previousStatus.completed_signers,
              total_signers: response.data?.total_signers ?? previousStatus.total_signers,
              otp_verified: isOtpSignature ? true : previousStatus.otp_verified,
              otp_expires_at: isOtpSignature ? null : previousStatus.otp_expires_at,
            }
          : previousStatus
      ));

      onNavigate('signature-confirmation');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Impossible de signer le document. Le lien est peut-etre expire.");
    } finally {
      setIsSigning(false);
    }
  };

  const documentName = publicStatus?.document_title || document?.name || 'Document a signer';
  const signerEmail = publicStatus?.current_signer_email || 'signataire@nexussign.local';
  const progressLabel = publicStatus
    ? `${publicStatus.completed_signers}/${publicStatus.total_signers} signature(s) finalisee(s)`
    : 'Chargement des informations du document';
  const isAlreadySigned = publicStatus?.current_signature_status === 'signé';

  const signatureModeLabel = useMemo(() => (
    isOtpSignature ? 'Signature numerique avec OTP' : 'Signature par dessin'
  ), [isOtpSignature]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Logo size="lg" variant="dark" showTagline onClick={() => onNavigate('landing')} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl text-white flex flex-col gap-4 shadow-2xl border-2 border-blue-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <p className="font-black text-lg">Lien de signature securise</p>
              <p className="text-sm text-blue-100 font-medium">Mode defini par l'administrateur: {signatureModeLabel}.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-white/30">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-bold">{progressLabel}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-white/30">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-bold">{signerEmail}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center text-red-700 font-bold">
            <AlertCircle className="w-6 h-6 mr-3" />
            {error}
          </div>
        )}

        {isLoadingDocument ? (
          <Card className="border-3 border-gray-200 shadow-2xl">
            <CardContent className="p-12 flex items-center justify-center text-gray-600 font-semibold">
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Chargement du document...
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-3 border-gray-200 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-5 mb-6 pb-6 border-b-2 border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-black text-gray-900 mb-2">{documentName}</h1>
                      <p className="text-gray-600 font-medium mb-4">
                        {isAlreadySigned
                          ? "Votre signature a deja ete enregistree pour ce document."
                          : `Ce document requiert le mode: ${signatureModeLabel}.`}
                      </p>
                      {publicStatus && (
                        <div className="flex flex-wrap gap-3 text-sm font-semibold">
                          <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 border border-blue-100">
                            Statut du document: {publicStatus.document_status}
                          </span>
                          <span className="rounded-full bg-slate-50 px-4 py-2 text-slate-700 border border-slate-200">
                            Votre statut: {publicStatus.current_signature_status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!publicStatus?.can_sign ? (
                    <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-green-800">
                      <div className="flex items-center font-black text-lg mb-2">
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        Signature deja enregistree
                      </div>
                      <p className="font-medium">
                        Ce lien a deja servi a signer le document. Vous pouvez poursuivre jusqu'a l'ecran de confirmation si besoin.
                      </p>
                      <div className="mt-4">
                        <Button
                          onClick={() => onNavigate('signature-confirmation')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                          Voir l'etat de la signature
                        </Button>
                      </div>
                    </div>
                  ) : isOtpSignature ? (
                    <div className="space-y-5">
                      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                        <p className="text-sm font-semibold text-emerald-800">
                          Signature numerique activee: un OTP email est requis avant la validation finale.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signer-name" className="text-sm font-semibold text-slate-800">
                          Nom du signataire
                        </Label>
                        <Input
                          id="signer-name"
                          value={typedSignerName}
                          onChange={(e) => setTypedSignerName(e.target.value)}
                          placeholder="Entrez votre nom complet"
                          className="h-12 border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-bold text-slate-900">Verification OTP</p>
                            <p className="text-sm text-slate-600">Un code a 6 chiffres sera envoye a {signerEmail}.</p>
                          </div>
                          <Button
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            {isSendingOtp ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Envoi OTP...
                              </>
                            ) : (
                              'Recevoir un OTP'
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="otp-code" className="text-sm font-semibold text-slate-800">
                            Code OTP
                          </Label>
                          <Input
                            id="otp-code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            inputMode="numeric"
                            className="h-12 border-2 border-gray-200 tracking-[0.35em] text-center text-lg font-bold focus:border-emerald-500"
                          />
                        </div>

                        {otpFeedback && (
                          <p className="text-sm font-medium text-emerald-700">{otpFeedback}</p>
                        )}

                        {otpPreview && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            Code OTP de test (mode dev): <span className="font-black tracking-[0.35em]">{otpPreview}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-gray-900">Votre signature par dessin</h3>

                      {signature ? (
                        <div className="border-3 border-green-300 rounded-xl p-8 bg-gradient-to-br from-green-50 to-cyan-50">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-gray-700">Apercu du rendu</p>
                            <Button
                              variant="outline"
                              onClick={() => setIsModalOpen(true)}
                              size="sm"
                              className="border-2 border-blue-300 font-bold"
                              disabled={isSigning}
                            >
                              Changer
                            </Button>
                          </div>
                          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 flex items-center justify-center min-h-[150px]">
                            {signature.type === 'draw' || signature.type === 'upload' ? (
                              <img src={signature.data} alt="Signature" className="max-h-32 object-contain" />
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50 text-center">
                          <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg"
                          >
                            Creer ma signature par dessin
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {publicStatus?.can_sign && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSign}
                    disabled={isSigning || (!isOtpSignature && !signature)}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-2xl font-black px-12 py-8 text-xl"
                  >
                    {isSigning ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Traitement du PDF...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 mr-3" />
                        {isOtpSignature ? 'Valider OTP et signer' : 'Confirmer et signer'}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-3 border-gray-200 shadow-xl p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">Instructions</h3>
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">1</span>
                    Le mode impose par l'administrateur pour ce document est: {signatureModeLabel.toLowerCase()}.
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">2</span>
                    Votre progression actuelle est {progressLabel.toLowerCase()}.
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">3</span>
                    {isOtpSignature
                      ? "Demandez un OTP, saisissez le code recu puis confirmez la signature."
                      : "Dessinez ou importez votre signature avant de confirmer."}
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        signerName={signerEmail}
        allowedModes={['draw', 'upload']}
      />
    </div>
  );
}
