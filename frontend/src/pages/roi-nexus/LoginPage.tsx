import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';
import { consumeAuthNotice, persistAuthSession } from '../../utils/auth';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'login' | 'landing') => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const authNotice = consumeAuthNotice();
    if (authNotice) {
      setError(authNotice);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const email = formData.email.trim();
      const formDataBody = new FormData();
      formDataBody.append('username', email);
      formDataBody.append('password', formData.password);

      const response = await api.post('/auth/login', formDataBody);
      persistAuthSession(response.data.access_token, response.data);
      onLogin();
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.response?.data?.detail || 'Identifiants invalides ou serveur indisponible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-8">
      <div className="w-full" style={{ maxWidth: 460 }}>
        <div
          className="bg-white"
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: 28,
            padding: 28,
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)'
          }}
        >
          <div className="flex justify-center">
            <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Connexion</h1>
            <p className="mt-2 text-sm text-slate-500">Accedez a votre espace securise.</p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
                Email professionnel
              </Label>

              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400"
                  style={{ left: 16, width: 20, height: 20 }}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@entreprise.com"
                  autoComplete="username"
                  autoFocus
                  className="w-full border bg-white text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus-visible:outline-none"
                  style={{
                    height: 56,
                    borderColor: '#CBD5E1',
                    borderRadius: 18,
                    paddingLeft: 52,
                    paddingRight: 16,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
                Mot de passe
              </Label>

              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400"
                  style={{ left: 16, width: 20, height: 20 }}
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  autoComplete="current-password"
                  className="w-full border bg-white text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus-visible:outline-none"
                  style={{
                    height: 56,
                    borderColor: '#CBD5E1',
                    borderRadius: 18,
                    paddingLeft: 52,
                    paddingRight: 52,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                  }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  style={{
                    right: 12,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group w-full border border-transparent text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none"
              style={{
                height: 56,
                borderRadius: 18,
                boxShadow: '0 16px 40px rgba(37, 99, 235, 0.24)',
                backgroundImage: 'linear-gradient(135deg, #0F172A 0%, #2563EB 55%, #06B6D4 100%)'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Les comptes entreprise sont crees par l'Admin Nexus.
          </p>
        </div>
      </div>
    </div>
  );
}
