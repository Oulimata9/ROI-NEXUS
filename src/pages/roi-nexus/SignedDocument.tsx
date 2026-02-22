import { Download, FileText, CheckCircle2, Shield, Users, Calendar, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Logo from '../../components/roi-nexus/Logo';

interface Document {
  id: string;
  name: string;
  status: string;
  date: string;
  signers: string[];
}

interface SignedDocumentProps {
  document: Document | null;
  onSignDocument: (id: string) => void;
}

export default function SignedDocument({ document, onSignDocument }: SignedDocumentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo size="md" variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/30 mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document signé avec succès
          </h1>
          <p className="text-lg text-gray-600">
            Votre document est maintenant complété et certifié
          </p>
        </div>

        {/* Document Info */}
        <Card className="border-2 border-gray-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{document?.name || 'Document.pdf'}</h2>
                  <Badge className="bg-green-100 text-green-700 border-0 mt-2">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Signé et certifié
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => document && onSignDocument(document.id)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700">Date de signature</p>
                </div>
                <p className="text-gray-900 font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">Statut</p>
                </div>
                <p className="text-gray-900 font-bold">Complété</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-gray-700">Signataires</p>
                </div>
                <p className="text-gray-900 font-bold">{document?.signers.length || 0}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-cyan-600" />
                  <p className="text-sm font-semibold text-gray-700">Sécurité</p>
                </div>
                <p className="text-gray-900 font-bold">AES-256</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Preview */}
        <Card className="border-2 border-gray-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Aperçu du document signé</h3>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12">
              <div className="aspect-[3/4] bg-white rounded-lg shadow-xl flex flex-col border-2 border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-green-500 to-emerald-600" />
                <div className="flex-1 flex items-center justify-center p-8 relative z-10">
                  <div className="text-center">
                    <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                    <p className="text-gray-600 font-medium mb-2">Document PDF Signé</p>
                    <p className="text-sm text-gray-500 max-w-md mb-6">
                      Le document complet avec toutes les signatures certifiées
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Certifié et horodaté</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signers List */}
        <Card className="border-2 border-gray-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Signataires ({document?.signers.length || 0})
            </h3>
            <div className="space-y-3">
              {document?.signers.map((signer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{signer}</p>
                      <p className="text-sm text-gray-600">
                        Signé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Signé
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Certificate */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Certificat de signature
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Horodatage certifié</p>
                  <p className="text-sm text-gray-600">
                    Chaque signature a été horodatée par un tiers de confiance le {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Chiffrement sécurisé</p>
                  <p className="text-sm text-gray-600">
                    Le document est protégé par chiffrement AES-256 de bout en bout
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Valeur juridique</p>
                  <p className="text-sm text-gray-600">
                    Conforme aux réglementations eIDAS et normes internationales de signature électronique
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email de confirmation</p>
                  <p className="text-sm text-gray-600">
                    Une copie du document signé a été envoyée à tous les signataires
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => document && onSignDocument(document.id)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le document
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-50"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Envoyer par email
          </Button>
        </div>
      </div>
    </div>
  );
}
