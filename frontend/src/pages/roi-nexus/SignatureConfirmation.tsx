import { CheckCircle2, Download, Mail, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import Logo from '../../components/roi-nexus/Logo';

interface SignatureConfirmationProps {
  onNavigate: (page: 'landing' | 'signed-document') => void;
}

export default function SignatureConfirmation({ onNavigate }: SignatureConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Logo size="md" variant="light" onClick={() => onNavigate('landing')} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-2xl shadow-green-500/50 mb-6 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Signature enregistrée avec succès !
          </h1>
          <p className="text-xl text-blue-100">
            Votre signature électronique a été appliquée et certifiée
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-green-300 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-300" />
                </div>
                <h3 className="font-semibold text-white text-lg">Signature validée</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Votre signature a été horodatée à {new Date().toLocaleTimeString('fr-FR')} 
                le {new Date().toLocaleDateString('fr-FR')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-300 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="font-semibold text-white text-lg">Sécurisé</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Le document est protégé par chiffrement AES-256 et horodatage certifié
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-white/30 bg-white/10 backdrop-blur-lg shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-white/20">
                <p className="text-white font-semibold mb-2">Prochaines étapes</p>
                <p className="text-blue-100 text-sm">
                  Vous allez recevoir une copie du document signé par email
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-1">Email de confirmation</p>
                    <p className="text-blue-100 text-sm">
                      Un email de confirmation contenant le document signé vous sera envoyé dans quelques instants
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                  <Download className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-1">Téléchargement disponible</p>
                    <p className="text-blue-100 text-sm">
                      Vous pouvez télécharger une copie du document signé immédiatement
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                  <Shield className="w-5 h-5 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-1">Certificat de signature</p>
                    <p className="text-blue-100 text-sm">
                      Un certificat d'authenticité a été généré et attaché au document
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('signed-document')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl shadow-cyan-500/30"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le document
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm">
            Merci d'avoir utilisé Nexus Sign pour votre signature électronique
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
