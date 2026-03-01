import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'signup' | 'landing') => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // 1. Préparation des données au format OAuth2 (FormData)
      const formDataBody = new FormData();
      formDataBody.append('username', formData.email);
      formDataBody.append('password', formData.password);

      // 2. Appel au Backend
      const response = await api.post('/auth/login', formDataBody);
      
      // 3. Extraction du Token
      const token = response.data.access_token;
      
      // 4. Décodage du JWT pour récupérer les infos automatiques (ID, Entreprise, Rôle)
      // On utilise atob pour décoder la partie "payload" du token sans librairie externe
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      // 5. Sauvegarde propre dans le navigateur pour une session startup
      localStorage.setItem('token', token);
      localStorage.setItem('user_name', response.data.user_name || decodedPayload.sub);
      localStorage.setItem('id_user', decodedPayload.id_user);
      localStorage.setItem('id_entreprise', decodedPayload.id_entreprise);
      localStorage.setItem('user_role', decodedPayload.role);
      
      // 6. Succès et redirection
      onLogin(); 

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.detail || 
        "Identifiants invalides ou serveur indisponible."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT — VISUAL SECTION */}
        <div className="hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1200&auto=format&fit=crop"
            alt="Business collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 mr-3" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email professionnel</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@entreprise.com"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="password">Mot de passe</Label>
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all group"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Connexion...
                </span>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Nouveau sur Nexus Sign ?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-blue-600 font-bold hover:underline"
            >
              Créer un compte entreprise
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}