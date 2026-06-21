import { useState } from 'react';
import {
  ArrowRight, BarChart3, CheckCircle2, Clock, FileText,
  Globe, Lock, Play, Shield, Upload, UserCheck, Users, X, Zap,
} from 'lucide-react';

import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

type Profil = 'particulier' | 'entreprise';

const TYPE_CONTRAT_OPTIONS = [
  'Contrats commerciaux',
  'Documents RH',
  'Documents juridiques',
  'NDA / Confidentialité',
  'Autre',
];

const SOURCE_OPTIONS = [
  'Réseaux sociaux',
  'Bouche à oreille',
  'Recherche internet',
  'Événement professionnel',
  'Recommandation',
  'Autre',
];

const SECTEUR_OPTIONS = [
  'Finance & Banque',
  'Juridique & Conseil',
  'Immobilier',
  'Commerce & Distribution',
  'Santé',
  'Éducation',
  'Technologie',
  'Ressources humaines',
  'Autre',
];

const NB_CONTRATS_OPTIONS = [
  'Moins de 10 par mois',
  '10 à 50 par mois',
  '50 à 200 par mois',
  'Plus de 200 par mois',
];

interface FormData {
  profil: Profil;
  nom: string;
  email: string;
  telephone: string;
  typeContrat: string;
  nomEntreprise: string;
  secteur: string;
  nbContrats: string;
  message: string;
  source: string;
}

function AccessModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'profil' | 'form' | 'success'>('profil');
  const [form, setForm] = useState<FormData>({
    profil: 'entreprise',
    nom: '',
    email: '',
    telephone: '',
    typeContrat: '',
    nomEntreprise: '',
    secteur: '',
    nbContrats: '',
    message: '',
    source: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nom.trim()) e.nom = 'Champ requis';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.telephone.trim()) e.telephone = 'Champ requis';
    if (!form.typeContrat) e.typeContrat = 'Champ requis';
    if (!form.source) e.source = 'Champ requis';
    if (form.profil === 'entreprise') {
      if (!form.nomEntreprise.trim()) e.nomEntreprise = 'Champ requis';
      if (!form.secteur) e.secteur = 'Champ requis';
      if (!form.nbContrats) e.nbContrats = 'Champ requis';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step 1 — Profil */}
        {step === 'profil' && (
          <div className="p-8">
            <div className="mb-6 text-center">
              <Logo size="md" variant="dark" />
              <h2 className="mt-4 text-2xl font-black text-slate-900">Demande d'accès</h2>
              <p className="mt-2 text-sm text-slate-500">
                Vous souhaitez accéder à la plateforme ? Dites-nous qui vous êtes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { set('profil', 'particulier'); setStep('form'); }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <UserCheck className="h-7 w-7 text-blue-600" />
                </div>
                <p className="font-bold text-slate-900">Particulier</p>
                <p className="text-xs text-slate-500">Usage personnel ou freelance</p>
              </button>
              <button
                onClick={() => { set('profil', 'entreprise'); setStep('form'); }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 p-6 text-center transition hover:border-cyan-400 hover:bg-cyan-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                  <Users className="h-7 w-7 text-cyan-600" />
                </div>
                <p className="font-bold text-slate-900">Entreprise</p>
                <p className="text-xs text-slate-500">PME, startup, cabinet…</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8">
            <button
              type="button"
              onClick={() => setStep('profil')}
              className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700"
            >
              ← Changer de profil
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${form.profil === 'entreprise' ? 'bg-cyan-100' : 'bg-blue-100'}`}>
                {form.profil === 'entreprise'
                  ? <Users className="h-5 w-5 text-cyan-600" />
                  : <UserCheck className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <p className="font-black text-slate-900">
                  {form.profil === 'entreprise' ? 'Profil Entreprise' : 'Profil Particulier'}
                </p>
                <p className="text-xs text-slate-500">Tous les champs marqués * sont obligatoires</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <Label htmlFor="nom">Nom complet *</Label>
                <Input
                  id="nom"
                  className="mt-1"
                  placeholder="Ex : Aminata Diallo"
                  value={form.nom}
                  onChange={(e) => set('nom', e.target.value)}
                />
                {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
              </div>

              {/* Email + Téléphone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Adresse e-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    className="mt-1"
                    placeholder="+221 77 000 00 00"
                    value={form.telephone}
                    onChange={(e) => set('telephone', e.target.value)}
                  />
                  {errors.telephone && <p className="mt-1 text-xs text-red-500">{errors.telephone}</p>}
                </div>
              </div>

              {/* Champs Entreprise */}
              {form.profil === 'entreprise' && (
                <>
                  <div>
                    <Label htmlFor="nomEntreprise">Nom de l'entreprise *</Label>
                    <Input
                      id="nomEntreprise"
                      className="mt-1"
                      placeholder="Ex : AfriTrans SA"
                      value={form.nomEntreprise}
                      onChange={(e) => set('nomEntreprise', e.target.value)}
                    />
                    {errors.nomEntreprise && <p className="mt-1 text-xs text-red-500">{errors.nomEntreprise}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="secteur">Secteur d'activité *</Label>
                      <select
                        id="secteur"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={form.secteur}
                        onChange={(e) => set('secteur', e.target.value)}
                      >
                        <option value="">Choisir…</option>
                        {SECTEUR_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.secteur && <p className="mt-1 text-xs text-red-500">{errors.secteur}</p>}
                    </div>
                    <div>
                      <Label htmlFor="nbContrats">Nb de contrats / mois *</Label>
                      <select
                        id="nbContrats"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={form.nbContrats}
                        onChange={(e) => set('nbContrats', e.target.value)}
                      >
                        <option value="">Choisir…</option>
                        {NB_CONTRATS_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      {errors.nbContrats && <p className="mt-1 text-xs text-red-500">{errors.nbContrats}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Type de contrat */}
              <div>
                <Label htmlFor="typeContrat">Type de contrat recherché *</Label>
                <select
                  id="typeContrat"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.typeContrat}
                  onChange={(e) => set('typeContrat', e.target.value)}
                >
                  <option value="">Choisir…</option>
                  {TYPE_CONTRAT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.typeContrat && <p className="mt-1 text-xs text-red-500">{errors.typeContrat}</p>}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Message ou besoin spécifique</Label>
                <textarea
                  id="message"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Décrivez votre besoin en quelques mots…"
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>

              {/* Source */}
              <div>
                <Label htmlFor="source">Comment avez-vous entendu parler de Nexus Sign ? *</Label>
                <select
                  id="source"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.source}
                  onChange={(e) => set('source', e.target.value)}
                >
                  <option value="">Choisir…</option>
                  {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 text-white font-bold hover:from-slate-950 hover:via-blue-700 hover:to-cyan-600"
            >
              Envoyer ma demande
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Step 3 — Succès */}
        {step === 'success' && (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Demande envoyée !</h2>
            <p className="mt-3 max-w-sm text-sm text-slate-500 leading-relaxed">
              Merci <strong>{form.nom}</strong>. Notre équipe reviendra vers vous à l'adresse{' '}
              <strong>{form.email}</strong> dans les meilleurs délais.
            </p>
            <Button
              onClick={onClose}
              className="mt-8 rounded-xl bg-slate-900 px-8 text-white hover:bg-slate-800"
            >
              Fermer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      icon: Upload,
      title: 'Téléchargement instantané',
      description: 'Glissez-déposez vos documents et commencez à signer en quelques secondes',
    },
    {
      icon: UserCheck,
      title: 'Gestion des signataires',
      description: "Ajoutez plusieurs signataires et définissez l'ordre de signature",
    },
    {
      icon: CheckCircle2,
      title: 'Signature sécurisée',
      description: 'Signatures juridiquement valables avec chiffrement de bout en bout',
    },
    {
      icon: Clock,
      title: 'Horodatage certifié',
      description: 'Chaque signature est horodatée pour garantir la validité',
    },
    {
      icon: Shield,
      title: 'Conformité totale',
      description: 'Conforme aux normes internationales et africaines de signature électronique',
    },
    {
      icon: BarChart3,
      title: 'Analytics avancés',
      description: 'Suivez et analysez tous vos documents en temps réel',
    },
  ];

  const useCases = [
    {
      icon: FileText,
      title: 'Contrats commerciaux',
      description: 'Signez vos contrats de vente, partenariats et accords commerciaux en toute sécurité',
      image: 'https://images.unsplash.com/photo-1689152496131-9cecc95cde25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBoYW5kc2hha2UlMjBwYXJ0bmVyc2hpcHxlbnwxfHx8fDE3NzA1NjMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Users,
      title: 'Documents RH',
      description: "Contrats de travail, avenants et documents administratifs pour vos équipes",
      image: 'https://images.unsplash.com/photo-1573164574511-73c773193279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBjb25mZXJlbmNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NzA1NjMyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Shield,
      title: 'Documents juridiques',
      description: 'NDA, accords de confidentialité et documents légaux avec valeur juridique',
      image: 'https://images.unsplash.com/photo-1770191954675-06f770e6cbd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWwlMjBzbWlsZXxlbnwxfHx8fDE3NzA1NjMyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modal */}
      {showModal && <AccessModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-gray-100 bg-white/98 shadow-lg backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <Logo size="lg" variant="dark" showTagline />
            <nav className="hidden items-center space-x-8 md:flex">
              <a href="#features" className="text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600">
                Fonctionnalités
              </a>
              <a href="#use-cases" className="text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600">
                Cas d'usage
              </a>
              <a href="#security" className="text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600">
                Sécurité
              </a>
              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className="font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 font-semibold text-white shadow-xl shadow-blue-500/40 hover:from-blue-700 hover:to-cyan-600"
                size="lg"
              >
                Accéder à la plateforme
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 pb-36 pt-24">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-40 -top-40 h-96 w-96 animate-blob rounded-full bg-blue-500 mix-blend-overlay filter blur-3xl" />
          <div className="animation-delay-2000 absolute -bottom-40 -left-40 h-96 w-96 animate-blob rounded-full bg-cyan-500 mix-blend-overlay filter blur-3xl" />
          <div className="animation-delay-4000 absolute left-1/2 top-1/2 h-96 w-96 animate-blob rounded-full bg-indigo-500 mix-blend-overlay filter blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <Badge className="border-2 border-cyan-400/40 bg-blue-500/20 px-5 py-2.5 text-sm font-bold text-cyan-300 backdrop-blur-sm">
                <Globe className="mr-2 h-4 w-4" />
                Solution africaine de signature électronique
              </Badge>
              <h1 className="text-5xl font-black leading-tight text-white lg:text-7xl">
                Signez vos documents
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                  en toute confiance
                </span>
              </h1>
              <p className="text-xl font-medium leading-relaxed text-blue-100 lg:text-2xl">
                Nexus Sign est la première plateforme de signature électronique conçue pour les entreprises africaines.
                Simple, sécurisée et juridiquement valable partout en Afrique.
              </p>
              <div className="flex flex-col gap-5 sm:flex-row">
                <Button
                  onClick={() => setShowModal(true)}
                  size="lg"
                  className="group bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-8 text-lg font-bold text-white shadow-2xl shadow-cyan-500/40 hover:from-cyan-600 hover:to-blue-600"
                >
                  Accéder à la plateforme
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-cyan-400 bg-white/10 px-10 py-8 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20"
                >
                  <Play className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                  Voir la démo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-8">
                {[
                  { icon: CheckCircle2, label: 'Juridiquement valable' },
                  { icon: CheckCircle2, label: 'Sécurité maximale' },
                  { icon: Globe, label: 'Made for Africa' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center space-x-2 rounded-xl border border-cyan-400/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-cyan-300" />
                    <span className="text-sm font-bold text-blue-100">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl shadow-blue-900/60">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765648684630-ac9c15ac98d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3N3b21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzE1OTc4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="African businesswoman using digital signature"
                  className="h-[550px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-2xl">
                <div className="flex items-center space-x-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-gray-900">98%</p>
                    <p className="text-sm font-semibold text-gray-600">Plus rapide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — "Tout ce dont vous avez besoin" */}
      <section id="features" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <Badge className="mb-6 border-2 border-blue-200 bg-blue-100 px-4 py-2 font-bold text-blue-700">
              Fonctionnalités
            </Badge>
            <h2 className="mb-6 text-5xl font-black text-gray-900">Tout ce dont vous avez besoin</h2>
            <p className="mx-auto max-w-3xl text-xl font-medium text-gray-600">
              Une plateforme complète pensée pour les réalités des entreprises africaines
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`cursor-pointer border-3 transition-all duration-300 ${
                    hoveredFeature === index
                      ? 'scale-105 border-blue-500 shadow-2xl shadow-blue-500/30'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardContent className="p-8">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                      hoveredFeature === index
                        ? 'scale-110 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg'
                        : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-8 w-8 transition-colors ${hoveredFeature === index ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="font-medium leading-relaxed text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="bg-gradient-to-br from-gray-50 to-blue-50/50 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <Badge className="mb-6 border-2 border-cyan-200 bg-cyan-100 px-4 py-2 font-bold text-cyan-700">
              Cas d'usage
            </Badge>
            <h2 className="mb-6 text-5xl font-black text-gray-900">Parfait pour tous vos besoins</h2>
            <p className="mx-auto max-w-3xl text-xl font-medium text-gray-600">
              Nexus Sign s'adapte à tous vos types de documents professionnels
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="group overflow-hidden border-3 border-gray-200 transition-all hover:border-cyan-400 hover:shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={useCase.image}
                      alt={useCase.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-xl">
                        <Icon className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="mb-3 text-2xl font-bold text-gray-900">{useCase.title}</h3>
                    <p className="font-medium leading-relaxed text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <Badge className="mb-6 border-2 border-indigo-200 bg-indigo-100 px-4 py-2 font-bold text-indigo-700">
              Comment ça marche
            </Badge>
            <h2 className="mb-6 text-5xl font-black text-gray-900">Signez en 3 étapes simples</h2>
          </div>
          <div className="relative grid gap-16 md:grid-cols-3">
            <div className="absolute left-0 right-0 hidden h-2 rounded-full bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 md:block" style={{ top: '96px', left: '16.666%', right: '16.666%' }} />
            {[
              { step: 1, icon: Upload, title: 'Téléchargez', desc: 'Importez votre document PDF en quelques secondes' },
              { step: 2, icon: UserCheck, title: 'Ajoutez les signataires', desc: 'Invitez les personnes qui doivent signer' },
              { step: 3, icon: CheckCircle2, title: 'Signez et archivez', desc: 'Recevez le document signé automatiquement' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/40 transition-transform group-hover:scale-110">
                    <Icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute right-0 top-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-50 bg-white shadow-xl">
                    <span className="text-2xl font-black text-blue-600">{item.step}</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">{item.title}</h3>
                  <p className="font-medium leading-relaxed text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 py-28 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Badge className="mb-8 border-2 border-cyan-400/40 bg-cyan-500/20 px-4 py-2 font-bold text-cyan-300 backdrop-blur-sm">
                Sécurité de niveau entreprise
              </Badge>
              <h2 className="mb-8 text-5xl font-black">Vos documents sont en sécurité maximale</h2>
              <p className="mb-10 text-xl font-medium leading-relaxed text-blue-100">
                Nexus Sign utilise les technologies de chiffrement les plus avancées. Conforme aux normes africaines et internationales.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Chiffrement de bout en bout', desc: 'AES-256 et SSL/TLS pour toutes les communications' },
                  { icon: CheckCircle2, title: 'Conformité juridique', desc: 'Conforme eIDAS, UEMOA et normes africaines' },
                  { icon: Clock, title: 'Horodatage certifié', desc: 'Chaque signature est horodatée par un tiers de confiance' },
                  { icon: Lock, title: 'Infrastructure sécurisée', desc: 'Serveurs avec sauvegarde redondante et monitoring 24/7' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start space-x-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 backdrop-blur-sm">
                        <Icon className="h-7 w-7 text-cyan-300" />
                      </div>
                      <div>
                        <h4 className="mb-2 text-lg font-bold">{item.title}</h4>
                        <p className="font-medium text-blue-200">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1528901166007-3784c7dd3653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBjeWJlcnNlY3VyaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE1OTc2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cybersecurity and data protection"
                className="h-[600px] w-full rounded-3xl border-4 border-white/10 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 py-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-5xl font-black text-white">Prêt à transformer vos processus de signature ?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-2xl font-medium leading-relaxed text-blue-100">
            Rejoignez les entreprises africaines qui font confiance à Nexus Sign
          </p>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="group bg-white px-12 py-8 text-xl font-black text-blue-600 shadow-2xl hover:bg-gray-100"
          >
            Demander l'accès
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-8 text-lg font-semibold text-blue-100">
            Solution professionnelle de signature électronique pour l'Afrique
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-20 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <Logo size="lg" variant="light" showTagline />
              <p className="mt-6 text-sm font-medium leading-relaxed">
                La première plateforme de signature électronique professionnelle conçue pour l'Afrique.
                Simple, sécurisée et juridiquement valable.
              </p>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white">Produit</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#features" className="transition-colors hover:text-white">Fonctionnalités</a></li>
                <li><a href="#use-cases" className="transition-colors hover:text-white">Cas d'usage</a></li>
                <li><a href="#security" className="transition-colors hover:text-white">Sécurité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white">Ressources</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="transition-colors hover:text-white">Documentation</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Guides</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white">Entreprise</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="transition-colors hover:text-white">À propos</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
                <li><a href="#" className="transition-colors hover:text-white">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-10 md:flex-row">
            <p className="text-sm font-medium">© 2026 Nexus Sign. Tous droits réservés.</p>
            <div className="mt-6 flex space-x-8 text-sm font-medium md:mt-0">
              <a href="#" className="transition-colors hover:text-white">Confidentialité</a>
              <a href="#" className="transition-colors hover:text-white">CGU</a>
              <a href="#" className="transition-colors hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
