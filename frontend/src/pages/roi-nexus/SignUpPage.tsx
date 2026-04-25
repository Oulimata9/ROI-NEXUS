import { ArrowRight, Building2, Shield, UserCheck } from 'lucide-react';

import Logo from '../../components/roi-nexus/Logo';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

interface SignUpPageProps {
  onNavigate: (page: 'login' | 'landing') => void;
}

export default function SignUpPage({ onNavigate }: SignUpPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-3xl">
        <div className="flex justify-center">
          <Logo size="lg" variant="dark" onClick={() => onNavigate('landing')} />
        </div>

        <Card className="mt-8 overflow-hidden border-2 border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardContent className="grid gap-8 p-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-gradient-to-br from-slate-950 via-blue-700 to-cyan-500 p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Nexus Sign</p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Les entreprises ne s'inscrivent plus seules
              </h1>
              <p className="mt-4 text-base font-medium leading-relaxed text-blue-100">
                Les nouveaux comptes sont maintenant crees par l'Admin Nexus pour garder un onboarding plus controle
                et plus professionnel.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Comment ca fonctionne maintenant</h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-slate-600">
                Lorsqu'une nouvelle entreprise rejoint Nexus Sign, l'Admin Nexus cree son compte entreprise et son
                administrateur. L'entreprise recoit ensuite ses acces et peut se connecter directement.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">Creation centralisee</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                      L'Admin Nexus cree l'entreprise, son administrateur et les acces initiaux.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">Entreprise prete a l'emploi</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                      Une fois le compte ouvert, l'entreprise n'a plus qu'a se connecter et utiliser la plateforme.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">Acces controles</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                      Le parcours est plus propre: pas d'auto-inscription, seulement des comptes valides et verifies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => onNavigate('login')}
                  className="h-12 bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-500 text-white hover:from-slate-900 hover:via-blue-800 hover:to-cyan-600"
                >
                  Aller a la connexion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={() => onNavigate('landing')} className="h-12 border-slate-300">
                  Retour a l'accueil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
