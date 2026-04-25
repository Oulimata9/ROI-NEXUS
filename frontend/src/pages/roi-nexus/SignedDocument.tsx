import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Download, FileText, Loader2, Shield, Users } from 'lucide-react';

import api from '../../api/axios';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import type { PublicSignatureStatus } from '../../types/signature';

interface Document {
  id: string;
  name: string;
  status: string;
  date: string;
  signers: string[];
}

interface SignedDocumentProps {
  document: Document | null;
  token: string;
  onDownloadDocument: () => Promise<void> | void;
  onNavigate: (page: 'landing') => void;
}

export default function SignedDocument({ document, token, onDownloadDocument, onNavigate }: SignedDocumentProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [publicStatus, setPublicStatus] = useState<PublicSignatureStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPublicStatus = async () => {
      if (!token) {
        setError("Lien de document invalide.");
        setIsLoadingStatus(false);
        return;
      }

      setIsLoadingStatus(true);

      try {
        const response = await api.get<PublicSignatureStatus>(`/signatures/public/${token}`);
        if (!isMounted) {
          return;
        }

        setPublicStatus(response.data);
        setError('');
      } catch (err: any) {
        if (!isMounted) {
          return;
        }

        setError(err.response?.data?.detail || "Impossible de charger l'etat du document.");
      } finally {
        if (isMounted) {
          setIsLoadingStatus(false);
        }
      }
    };

    void loadPublicStatus();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleDownload = async () => {
    if (publicStatus && !publicStatus.can_download) {
      setError("Le PDF final sera disponible une fois toutes les signatures completes.");
      return;
    }

    try {
      setIsDownloading(true);
      setError('');
      await onDownloadDocument();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Impossible de telecharger le document signe.");
    } finally {
      setIsDownloading(false);
    }
  };

  const documentName = publicStatus?.document_title || document?.name || 'Document signe';
  const isFullySigned = publicStatus?.can_download ?? false;
  const completedSigners = publicStatus?.completed_signers ?? 0;
  const totalSigners = publicStatus?.total_signers ?? document?.signers.length ?? 0;
  const signatureDate = publicStatus?.current_signature_date
    ? new Date(publicStatus.current_signature_date).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full shadow-lg mb-6 ${
              isFullySigned
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
                : 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-blue-500/30'
            }`}
          >
            {isLoadingStatus ? <Loader2 className="w-12 h-12 text-white animate-spin" /> : <CheckCircle2 className="w-12 h-12 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFullySigned ? 'Document signe avec succes' : 'Signature enregistree'}
          </h1>
          <p className="text-lg text-gray-600">
            {isFullySigned
              ? 'Le document final est maintenant complet et pret au telechargement.'
              : 'Votre signature est enregistree. Le document final sera disponible apres les autres signatures.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
            {error}
          </div>
        )}

        <Card className="border-2 border-gray-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{documentName}</h2>
                  <Badge className={isFullySigned ? 'bg-green-100 text-green-700 border-0 mt-2' : 'bg-blue-100 text-blue-700 border-0 mt-2'}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {isFullySigned ? 'Pret au telechargement' : 'En attente des autres signatures'}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !isFullySigned}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {isDownloading ? 'Telechargement...' : 'Telecharger'}
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700">Votre signature</p>
                </div>
                <p className="text-gray-900 font-bold">{signatureDate}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">Statut</p>
                </div>
                <p className="text-gray-900 font-bold">{publicStatus?.document_status || 'Chargement'}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-gray-700">Progression</p>
                </div>
                <p className="text-gray-900 font-bold">{completedSigners}/{totalSigners}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-cyan-600" />
                  <p className="text-sm font-semibold text-gray-700">Acces</p>
                </div>
                <p className="text-gray-900 font-bold">{publicStatus?.current_signer_email || 'Lien securise'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Etat du document</h3>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border border-blue-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Document</p>
                  <p className="text-xl font-bold text-gray-900">{documentName}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Signatures finalisees</p>
                  <p className="text-xl font-bold text-blue-700">{completedSigners} sur {totalSigners}</p>
                </div>
              </div>

              <div className="mt-6 h-3 rounded-full bg-white border border-blue-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                  style={{ width: totalSigners > 0 ? `${(completedSigners / totalSigners) * 100}%` : '0%' }}
                />
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {isFullySigned
                  ? "Toutes les signatures requises sont presentes. Le PDF final peut etre telecharge."
                  : "Le PDF final restera bloque jusqu'a la derniere signature requise."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Garantie de signature
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Lien public securise</p>
                  <p className="text-sm text-gray-600">
                    Les informations visibles sur cette page sont chargees directement depuis le token de signature.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Progression temps reel</p>
                  <p className="text-sm text-gray-600">
                    L'etat du document et la disponibilite du telechargement suivent le nombre reel de signatures finalisees.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Telechargement final controle</p>
                  <p className="text-sm text-gray-600">
                    Le PDF final ne devient disponible qu'une fois toutes les signatures completes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !isFullySigned}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? 'Telechargement...' : 'Telecharger le document'}
          </Button>
        </div>
      </div>
    </div>
  );
}
