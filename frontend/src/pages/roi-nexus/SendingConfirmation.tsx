import { CheckCircle2, Mail, Users, Clock, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import Logo from '../../components/roi-nexus/Logo';

interface SendingConfirmationProps {
  onNavigate: (page: 'landing' | 'dashboard') => void;
}

export default function SendingConfirmation({ onNavigate }: SendingConfirmationProps) {
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
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-2xl shadow-green-500/50 mb-6 animate-pulse-scale">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Document envoyé avec succès !
          </h1>
          <p className="text-xl text-blue-100">
            Les signataires ont été notifiés par email
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-white/30 bg-white/10 backdrop-blur-lg shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-white/20">
                <p className="text-white font-semibold text-lg mb-2">Que se passe-t-il maintenant ?</p>
                <p className="text-blue-100 text-sm">
                  Suivez l'évolution de votre document en temps réel
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Emails envoyés</p>
                    <p className="text-blue-100 text-sm">
                      Chaque signataire a reçu un lien sécurisé pour accéder au document
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Ordre de signature</p>
                    <p className="text-blue-100 text-sm">
                      Les signataires recevront les invitations dans l'ordre que vous avez défini
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Notifications en temps réel</p>
                    <p className="text-blue-100 text-sm">
                      Vous recevrez une alerte à chaque signature effectuée
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Document finalisé</p>
                    <p className="text-blue-100 text-sm">
                      Une fois toutes les signatures collectées, vous recevrez le document final
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border border-white/30 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white mb-1">1</p>
              <p className="text-sm text-blue-200">Document envoyé</p>
            </CardContent>
          </Card>
          <Card className="border border-white/30 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white mb-1">0</p>
              <p className="text-sm text-blue-200">Signatures</p>
            </CardContent>
          </Card>
          <Card className="border border-white/30 bg-white/10 backdrop-blur-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-cyan-300 mb-1">...</p>
              <p className="text-sm text-blue-200">En attente</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('dashboard')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl shadow-cyan-500/30"
            size="lg"
          >
            Retour au tableau de bord
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm">
            Vous pouvez suivre l'avancement de votre document depuis votre tableau de bord
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s infinite;
        }
      `}</style>
    </div>
  );
}
