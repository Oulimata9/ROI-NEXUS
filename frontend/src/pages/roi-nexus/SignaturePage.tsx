import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Shield, Clock, Users, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Logo from '../../components/roi-nexus/Logo';
import SignatureModal from '../../components/roi-nexus/SignatureModal';
import api from '../../api/axios';

interface Document {
  id: string;
  name: string;
  status: string;
  date: string;
  signers: string[];
}

interface SignaturePageProps {
  document: Document | null;
  onNavigate: (page: 'signature-confirmation') => void;
}

export default function SignaturePage({ document, onNavigate }: SignaturePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signature, setSignature] = useState<{ data: string; type: 'draw' | 'type' | 'upload' } | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  
  // Récupération du token depuis l'URL (ex: ?token=abc12345...)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || "token_test_temporaire";

  const handleSaveSignature = (signatureData: string, type: 'draw' | 'type' | 'upload') => {
    setSignature({ data: signatureData, type });
    setIsModalOpen(false);
    setError('');
  };

  const handleSign = async () => {
    if (!signature) return;

    setIsSigning(true);
    setError('');

    try {
      // Appel au backend pour fusionner la signature sur le PDF
      // On envoie le nom visuel (data si c'est du texte, ou un nom par défaut si c'est un dessin)
      const response = await api.post(`/signatures/sign/${token}`, null, {
        params: {
          nom_visuel: signature.type === 'type' ? signature.data : "Signé via Nexus Sign",
          x: 100, // Coordonnées par défaut sur le PDF
          y: 150,
          page: 0
        }
      });

      console.log("Document signé avec succès:", response.data);
      onNavigate('signature-confirmation');
    } catch (err: any) {
      console.error("Erreur de signature:", err);
      setError("Impossible de signer le document. Le lien est peut-être expiré.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Logo size="lg" variant="dark" showTagline />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Security Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl text-white flex items-center justify-between shadow-2xl border-2 border-blue-400">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <p className="font-black text-lg">Connexion sécurisée</p>
              <p className="text-sm text-blue-100 font-medium">Document protégé par chiffrement de bout en bout SHA-256</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-white/30">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-bold">Lien sécurisé actif</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center text-red-700 font-bold">
            <AlertCircle className="w-6 h-6 mr-3" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-3 border-gray-200 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-start space-x-5 mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                      {document?.name || 'Contrat de prestation'}
                    </h1>
                    <p className="text-gray-600 font-medium mb-4">
                      Veuillez apposer votre signature numérique ci-dessous.
                    </p>
                  </div>
                </div>

                {/* Signature Box */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900">Votre signature</h3>

                  {signature ? (
                    <div className="border-3 border-green-300 rounded-xl p-8 bg-gradient-to-br from-green-50 to-cyan-50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-bold text-gray-700">Aperçu du rendu</p>
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
                        ) : (
                          <p className="text-4xl font-['Dancing_Script',cursive] text-blue-900">
                            {signature.data}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50 text-center">
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg"
                      >
                        Créer ma signature numérique
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {signature && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSign}
                  disabled={isSigning}
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
                      Confirmer et Signer
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="border-3 border-gray-200 shadow-xl p-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Instructions</h3>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">1</span>
                  Créez votre signature manuellement ou en tapant votre nom.
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">2</span>
                  Vérifiez l'aperçu visuel.
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">3</span>
                  Cliquez sur "Signer" pour valider l'intégrité du document.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        signerName="Signataire"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </div>
  );
}