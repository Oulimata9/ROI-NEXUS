import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Logo from '../../components/roi-nexus/Logo';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'signup' | 'landing') => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT — PHOTO ONLY */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1200&auto=format&fit=crop"
            alt="Business collaboration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT — CONTENT */}
        <div className="p-10 md:p-12 flex flex-col justify-center">

          <Logo size="lg" variant="dark" showTagline />

          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">
            Bon retour 👋
          </h1>

          <p className="text-gray-600 mb-8">
            Connectez-vous pour accéder à votre espace Nexus Sign
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="password">Mot de passe</Label>
                <a className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </a>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white group"
            >
              Se connecter
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Pas encore de compte ?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Créer un compte
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}