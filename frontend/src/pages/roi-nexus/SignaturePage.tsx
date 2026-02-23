import { useState } from 'react';
import { FileText, CheckCircle2, Shield, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Logo from '../../components/roi-nexus/Logo';
import SignatureModal from '../../components/roi-nexus/SignatureModal';

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
  const [currentSignerEmail] = useState('marie.martin@client.com'); // Mock signer

  const handleSaveSignature = (signatureData: string, type: 'draw' | 'type' | 'upload') => {
    setSignature({ data: signatureData, type });
    setIsModalOpen(false);
  };

  const handleSign = () => {
    if (signature) {
      onNavigate('signature-confirmation');
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
              <p className="text-sm text-blue-100 font-medium">Document protégé par chiffrement de bout en bout AES-256</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-white/30">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-bold">Session: 30 min</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Info */}
            <Card className="border-3 border-gray-200 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-start space-x-5 mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                      {document?.name || 'Document à signer'}
                    </h1>
                    <p className="text-gray-600 font-medium mb-4">
                      Veuillez lire attentivement et signer ce document
                    </p>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-200 font-bold">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(document?.date || Date.now()).toLocaleDateString('fr-FR')}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 border-2 border-green-200 font-bold">
                        <Users className="w-3 h-3 mr-1" />
                        {document?.signers?.length || 0} signataires
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border-3 border-gray-200 min-h-[400px] flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                    <p className="text-gray-600 font-bold text-lg mb-2">Aperçu du document</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Le document sera affiché ici avec les champs de signature
                    </p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Votre signature</h3>
                    {signature && (
                      <Badge className="bg-green-100 text-green-700 border-2 border-green-200 font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Signature ajoutée
                      </Badge>
                    )}
                  </div>

                  {signature ? (
                    <div className="border-3 border-green-300 rounded-xl p-8 bg-gradient-to-br from-green-50 to-cyan-50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-bold text-gray-700">Votre signature enregistrée</p>
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(true)}
                          size="sm"
                          className="border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 font-bold"
                        >
                          Modifier
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
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-gray-600 font-bold text-lg mb-4">
                        Vous devez ajouter votre signature
                      </p>
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/40 font-bold px-8"
                        size="lg"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Créer ma signature
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sign Button */}
            {signature && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSign}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/40 font-black px-12 py-8 text-lg"
                >
                  <CheckCircle2 className="w-6 h-6 mr-3" />
                  Signer le document
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Signer Info */}
            <Card className="border-3 border-gray-200 shadow-xl sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-6">Informations du signataire</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                      {currentSignerEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold">Signataire</p>
                      <p className="font-bold text-gray-900 break-words">{currentSignerEmail}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-semibold">Statut</span>
                      <Badge className="bg-yellow-100 text-yellow-700 border-2 border-yellow-200 font-bold">
                        En attente
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-semibold">Ordre</span>
                      <span className="font-black text-gray-900">1 / {document?.signers?.length || 1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-semibold">Date limite</span>
                      <span className="font-bold text-gray-900">7 jours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Sécurité
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Signature juridiquement valable</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Horodatage certifié</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Traçabilité complète</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Conforme aux normes africaines</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  Si vous rencontrez des problèmes ou avez des questions sur ce document, contactez-nous.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-bold"
                >
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        signerName={currentSignerEmail.split('@')[0]}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </div>
  );
}
