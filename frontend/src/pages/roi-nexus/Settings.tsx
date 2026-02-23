import { Settings as SettingsIcon, User, Mail, Lock, Bell, Shield, CreditCard, LogOut, FileText, Archive, Plus, BarChart3, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import Logo from '../../components/roi-nexus/Logo';

interface SettingsProps {
  onNavigate: (page: 'dashboard' | 'upload' | 'archive') => void;
  onLogout: () => void;
}

export default function Settings({ onNavigate, onLogout }: SettingsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Logo size="md" variant="dark" />
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                AC
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Acme Corp</p>
                <p className="text-sm text-gray-600">Plan Entreprise</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Tableau de bord</span>
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau document</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium">
              <FileText className="w-5 h-5" />
              <span>Mes documents</span>
            </button>
            <button
              onClick={() => onNavigate('archive')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <Archive className="w-5 h-5" />
              <span>Archives</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-medium shadow-lg shadow-blue-500/30">
              <SettingsIcon className="w-5 h-5" />
              <span>Paramètres</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Gérez les paramètres de votre compte et vos préférences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Informations du profil
                </CardTitle>
                <CardDescription>Gérez les informations de votre entreprise</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-semibold text-gray-700">
                      Nom de l'entreprise
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      defaultValue="Acme Corporation"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue="contact@acme.com"
                        className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-blue-600" />
                  Sécurité
                </CardTitle>
                <CardDescription>Protégez votre compte avec un mot de passe fort</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-semibold text-gray-700">
                      Mot de passe actuel
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                      Nouveau mot de passe
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                    <Save className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Notifications
                </CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être informé</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Notifications par email</p>
                      <p className="text-sm text-gray-600">Recevoir des emails pour les nouveaux documents</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Alertes de signature</p>
                      <p className="text-sm text-gray-600">Être notifié quand un document est signé</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">Rappels automatiques</p>
                      <p className="text-sm text-gray-600">Envoyer des rappels aux signataires</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
              <CardHeader className="border-b border-blue-200">
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Abonnement
                </CardTitle>
                <CardDescription>Plan Entreprise actif</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Plan Entreprise</p>
                      <p className="text-sm text-gray-600">Signatures illimitées • Support prioritaire</p>
                    </div>
                    <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                      Gérer l'abonnement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Conformité et sécurité
                </CardTitle>
                <CardDescription>Paramètres de sécurité avancés</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Chiffrement activé</p>
                        <p className="text-sm text-gray-600">AES-256 de bout en bout</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">Actif</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Horodatage certifié</p>
                        <p className="text-sm text-gray-600">Conformité juridique garantie</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">Actif</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
