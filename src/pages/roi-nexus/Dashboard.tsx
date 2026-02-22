import { FileText, Plus, Archive, Settings, LogOut, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, Download, Search, Filter, Calendar, BarChart3, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import Logo from '../../components/roi-nexus/Logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'completed';
  date: string;
  signers: string[];
}

interface DashboardProps {
  documents: Document[];
  onNavigate: (page: 'upload' | 'archive' | 'settings') => void;
  onLogout: () => void;
  onSelectDocument: (doc: Document) => void;
}

export default function Dashboard({ documents, onNavigate, onLogout, onSelectDocument }: DashboardProps) {
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const signedCount = documents.filter(d => d.status === 'signed').length;
  const completedCount = documents.filter(d => d.status === 'completed').length;
  const totalCount = documents.length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'signed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Signé
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Complété
          </Badge>
        );
    }
  };

  const recentActivity = [
    { action: 'Document signé', document: 'Contrat de service', time: 'Il y a 2h', user: 'marie.martin@client.com' },
    { action: 'Nouvel envoi', document: 'Proposition commerciale', time: 'Il y a 5h', user: 'alex.kouame@startup.ci' },
    { action: 'Document complété', document: 'Accord de confidentialité', time: 'Hier', user: 'paul.bernard@example.com' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r-2 border-gray-200 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Logo - Enhanced */}
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <Logo size="lg" variant="dark" showTagline />
          </div>

          {/* User Profile */}
          <div className="p-6 border-b-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                AC
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">Acme Corp</p>
                <p className="text-sm text-gray-600 font-semibold">Plan Entreprise</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium shadow-lg shadow-blue-500/30">
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
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <Settings className="w-5 h-5" />
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour, Acme Corp 👋</h1>
              <p className="text-gray-600">Voici un aperçu de vos activités de signature</p>
            </div>
            <Button
              onClick={() => onNavigate('upload')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau document
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0">+12%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 hover:border-yellow-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-yellow-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-0">{pendingCount}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">En attente</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 hover:border-green-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">98%</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Complétés</p>
              <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 hover:border-purple-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0">Excellent</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Taux de complétion</p>
              <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Documents */}
          <Card className="lg:col-span-2 border-2 border-gray-100 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents récents</CardTitle>
                  <CardDescription>Gérez vos documents et suivez leur statut</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {documents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">Aucun document pour le moment</p>
                  <Button
                    onClick={() => onNavigate('upload')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer votre premier document
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-6 hover:bg-blue-50/50 transition-all cursor-pointer group"
                      onClick={() => onSelectDocument(doc)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {doc.signers.length} signataire{doc.signers.length > 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(doc.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(doc.status)}
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-2 border-gray-100 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Suivez les dernières actions</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.document}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                Voir tout l'historique
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Vue d'ensemble des performances</CardTitle>
            <CardDescription>Analyse de vos documents ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Taux de complétion</span>
                  <span className="text-sm font-bold text-green-600">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Documents en attente</span>
                  <span className="text-sm font-bold text-yellow-600">{Math.round((pendingCount / totalCount) * 100)}%</span>
                </div>
                <Progress value={(pendingCount / totalCount) * 100} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Temps moyen signature</span>
                  <span className="text-sm font-bold text-blue-600">2.4h</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}