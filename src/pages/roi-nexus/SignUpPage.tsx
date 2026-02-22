import { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import Logo from '../../components/roi-nexus/Logo';

interface SignUpPageProps {
  onSignUp: () => void;
  onNavigate: (page: 'login' | 'landing') => void;
}

export default function SignUpPage({ onSignUp, onNavigate }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword && formData.email && formData.companyName) {
      onSignUp();
    }
  };

  const benefits = [
    'Configuration rapide',
    'Support client dédié',
    'Sécurité maximale',
    'Interface intuitive'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo - Enhanced */}
          <div className="mb-10">
            <button onClick={() => onNavigate('landing')} className="inline-block">
              <Logo size="xl" variant="dark" showTagline />
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-3">Créez votre compte</h1>
            <p className="text-gray-600 text-lg font-medium">Rejoignez les entreprises africaines qui digitalisent leurs signatures</p>
          </div>

          {/* Benefits */}
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-semibold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                Nom de l'entreprise
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Corporation"
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email professionnel
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white h-12 shadow-lg shadow-blue-500/30 group"
              size="lg"
            >
              Créer mon compte
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative overflow-hidden lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-overlay filter blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl" />
          </div>
        </div>
        <div className="relative h-full flex items-center justify-center p-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-6">
              Rejoignez 50,000+ entreprises africaines
            </h2>
            <p className="text-xl text-blue-100 mb-10 font-medium leading-relaxed">
              qui digitalisent leurs signatures avec Nexus Sign, la solution pensée pour l'Afrique
            </p>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765366417033-5d74f04ca77a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc3RhcnR1cCUyMG9mZmljZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzA1NjMyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African startup office workspace"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}