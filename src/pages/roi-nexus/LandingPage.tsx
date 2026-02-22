import { useState } from 'react';
import { FileText, Upload, UserCheck, Shield, Clock, CheckCircle2, TrendingUp, Zap, Globe, ArrowRight, Star, Play, BarChart3, Users, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Badge } from '../../components/ui/badge';
import Logo from '../../components/roi-nexus/Logo';

interface LandingPageProps {
  onNavigate: (page: 'signup' | 'login') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Upload,
      title: 'Téléchargement instantané',
      description: 'Glissez-déposez vos documents et commencez à signer en quelques secondes',
      color: 'blue'
    },
    {
      icon: UserCheck,
      title: 'Gestion des signataires',
      description: 'Ajoutez plusieurs signataires et définissez l\'ordre de signature',
      color: 'indigo'
    },
    {
      icon: CheckCircle2,
      title: 'Signature sécurisée',
      description: 'Signatures juridiquement valables avec chiffrement de bout en bout',
      color: 'green'
    },
    {
      icon: Clock,
      title: 'Horodatage certifié',
      description: 'Chaque signature est horodatée pour garantir la validité',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Conformité totale',
      description: 'Conforme aux normes internationales et africaines de signature électronique',
      color: 'cyan'
    },
    {
      icon: BarChart3,
      title: 'Analytics avancés',
      description: 'Suivez et analysez tous vos documents en temps réel',
      color: 'emerald'
    }
  ];

  const stats = [
    { value: '500K+', label: 'Documents signés' },
    { value: '50K+', label: 'Entreprises africaines' },
    { value: '99.9%', label: 'Taux de disponibilité' },
    { value: '24/7', label: 'Support client' }
  ];

  const testimonials = [
    {
      name: 'Aminata Diallo',
      role: 'CEO, TechStart Africa',
      location: 'Dakar, Sénégal',
      content: 'Nexus Sign a transformé notre processus de signature. Une solution vraiment adaptée aux réalités africaines.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1739300293504-234817eead52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3N3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzA1NjMyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Jean-Pierre Kouassi',
      role: 'Directeur Juridique, AfriBank',
      location: 'Abidjan, Côte d\'Ivoire',
      content: 'La sécurité et la conformité de Nexus Sign nous donnent une totale confiance. Excellent support.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1665495005618-6f55e5f77a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3NtYW4lMjBwcm9mZXNzaW9uYWwlMjBleGVjdXRpdmV8ZW58MXx8fHwxNzcwNTYzMjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Fatou Ndiaye',
      role: 'Fondatrice, StartHub Lagos',
      location: 'Lagos, Nigeria',
      content: 'Interface intuitive, support réactif. Exactement ce dont les startups africaines ont besoin.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA1NjMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const useCases = [
    {
      icon: FileText,
      title: 'Contrats commerciaux',
      description: 'Signez vos contrats de vente, partenariats et accords commerciaux en toute sécurité',
      image: 'https://images.unsplash.com/photo-1689152496131-9cecc95cde25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBoYW5kc2hha2UlMjBwYXJ0bmVyc2hpcHxlbnwxfHx8fDE3NzA1NjMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: Users,
      title: 'Documents RH',
      description: 'Contrats de travail, avenants et documents administratifs pour vos équipes',
      image: 'https://images.unsplash.com/photo-1573164574511-73c773193279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBjb25mZXJlbmNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NzA1NjMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: Shield,
      title: 'Documents juridiques',
      description: 'NDA, accords de confidentialité et documents légaux avec valeur juridique',
      image: 'https://images.unsplash.com/photo-1770191954675-06f770e6cbd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NzA1NjMyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Enhanced with prominent logo */}
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-xl border-b-2 border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-3">
              <Logo size="lg" variant="dark" showTagline />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-sm">
                Fonctionnalités
              </a>
              <a href="#use-cases" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-sm">
                Cas d'usage
              </a>
              <a href="#security" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-sm">
                Sécurité
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-sm">
                Témoignages
              </a>
              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => onNavigate('signup')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/40 font-semibold px-6"
                size="lg"
              >
                Commencer maintenant
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with African context */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 pt-24 pb-36">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-blue-500/20 text-cyan-300 border-2 border-cyan-400/40 px-5 py-2.5 text-sm font-bold backdrop-blur-sm">
                <Globe className="w-4 h-4 mr-2" />
                Solution africaine de signature électronique
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Signez vos documents
                <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                  en toute confiance
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed font-medium">
                Nexus Sign est la première plateforme de signature électronique conçue pour les entreprises africaines. 
                Simple, sécurisée et juridiquement valable partout en Afrique.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Button
                  onClick={() => onNavigate('signup')}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-2xl shadow-cyan-500/40 text-lg px-10 py-8 group font-bold"
                >
                  Commencer maintenant
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-cyan-400 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg px-10 py-8 group font-bold"
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Voir la démo
                </Button>
              </div>
              {/* Trust Badges */}
              <div className="flex items-center flex-wrap gap-6 pt-8">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-400/30">
                  <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm text-blue-100 font-bold">Juridiquement valable</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-400/30">
                  <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm text-blue-100 font-bold">Sécurité maximale</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-400/30">
                  <Globe className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm text-blue-100 font-bold">Made for Africa</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/60 border-4 border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765648684630-ac9c15ac98d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3N3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzE1OTc4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="African businesswoman using digital signature"
                  className="w-full h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-gray-900">98%</p>
                    <p className="text-sm text-gray-600 font-semibold">Plus rapide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </p>
                <p className="text-gray-300 font-bold text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-200 mb-6 px-4 py-2 font-bold">
              Fonctionnalités
            </Badge>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Une plateforme complète pensée pour les réalités des entreprises africaines
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`border-3 transition-all duration-300 cursor-pointer ${
                    hoveredFeature === index
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/30 scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      hoveredFeature === index
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 scale-110 shadow-lg'
                        : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-8 h-8 transition-colors ${
                        hoveredFeature === index ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-28 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-cyan-100 text-cyan-700 border-2 border-cyan-200 mb-6 px-4 py-2 font-bold">
              Cas d'usage
            </Badge>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Parfait pour tous vos besoins
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Nexus Sign s'adapte à tous vos types de documents professionnels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="border-3 border-gray-200 hover:border-cyan-400 hover:shadow-2xl transition-all overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={useCase.image}
                      alt={useCase.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-xl">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-indigo-100 text-indigo-700 border-2 border-indigo-200 mb-6 px-4 py-2 font-bold">
              Comment ça marche
            </Badge>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Signez en 3 étapes simples
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-2 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 rounded-full" style={{ top: '96px', left: '16.666%', right: '16.666%' }} />
            
            {[
              { step: 1, icon: Upload, title: 'Téléchargez', desc: 'Importez votre document PDF en quelques secondes', color: 'blue' },
              { step: 2, icon: UserCheck, title: 'Ajoutez les signataires', desc: 'Invitez les personnes qui doivent signer', color: 'cyan' },
              { step: 3, icon: CheckCircle2, title: 'Signez et archivez', desc: 'Recevez le document signé automatiquement', color: 'green' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform relative z-10">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-0 right-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-50 z-20">
                      <span className="text-2xl font-black text-blue-600">{item.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/40 mb-8 backdrop-blur-sm px-4 py-2 font-bold">
                Sécurité de niveau entreprise
              </Badge>
              <h2 className="text-5xl font-black mb-8">
                Vos documents sont en sécurité maximale
              </h2>
              <p className="text-xl text-blue-100 mb-10 font-medium leading-relaxed">
                Nexus Sign utilise les technologies de chiffrement les plus avancées pour protéger vos données sensibles. 
                Conforme aux normes africaines et internationales.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Chiffrement de bout en bout', desc: 'AES-256 et SSL/TLS pour toutes les communications' },
                  { icon: CheckCircle2, title: 'Conformité juridique', desc: 'Conforme eIDAS, UEMOA et normes africaines' },
                  { icon: Clock, title: 'Horodatage certifié', desc: 'Chaque signature est horodatée par un tiers de confiance' },
                  { icon: Lock, title: 'Infrastructure sécurisée', desc: 'Serveurs avec sauvegarde redondante et monitoring 24/7' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <Icon className="w-7 h-7 text-cyan-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                        <p className="text-blue-200 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1528901166007-3784c7dd3653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBjeWJlcnNlY3VyaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE1OTc2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Cybersecurity and data protection"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-purple-100 text-purple-700 border-2 border-purple-200 mb-6 px-4 py-2 font-bold">
              Témoignages
            </Badge>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Ce que nos clients africains disent
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Des entreprises de toute l'Afrique nous font confiance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-3 border-gray-200 hover:border-cyan-400 hover:shadow-2xl transition-all">
                <CardContent className="p-8">
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-4 ring-blue-100">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 font-semibold">{testimonial.role}</p>
                      <p className="text-xs text-blue-600 font-bold mt-1">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-black text-white mb-8">
            Prêt à transformer vos processus de signature ?
          </h2>
          <p className="text-2xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Rejoignez plus de 50,000 entreprises africaines qui font confiance à Nexus Sign
          </p>
          <Button
            onClick={() => onNavigate('signup')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl text-xl px-12 py-8 group font-black"
          >
            Commencer maintenant
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-blue-100 mt-8 text-lg font-semibold">
            Solution professionnelle de signature électronique pour l'Afrique
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <Logo size="lg" variant="light" showTagline />
              <p className="mt-6 text-sm leading-relaxed font-medium">
                La première plateforme de signature électronique professionnelle conçue pour l'Afrique. 
                Simple, sécurisée et juridiquement valable.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Produit</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Cas d'usage</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Ressources</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Entreprise</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-medium">© 2026 Nexus Sign. Tous droits réservés.</p>
            <div className="flex space-x-8 mt-6 md:mt-0 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}