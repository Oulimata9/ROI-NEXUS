import { Archive as ArchiveIcon, Download, Eye, Search, Calendar, FileText, Users, LogOut, Settings as SettingsIcon, Plus, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import Logo from '../../components/roi-nexus/Logo';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'completed';
  date: string;
  signers: string[];
}

interface ArchiveProps {
  documents: Document[];
  onNavigate: (page: 'dashboard' | 'upload' | 'settings') => void;
  onLogout: () => void;
}

export default function Archive({ documents, onNavigate, onLogout }: ArchiveProps) {
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
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-medium shadow-lg shadow-blue-500/30">
              <ArchiveIcon className="w-5 h-5" />
              <span>Archives</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Archives</h1>
                <p className="text-gray-600">Consultez tous vos documents signés et complétés</p>
              </div>
              <Button
                onClick={() => onNavigate('upload')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau document
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Documents archivés</p>
                    <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <ArchiveIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-green-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Ce mois-ci</p>
                    <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-purple-300 transition-all hover:shadow-xl bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">Signataires</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {documents.reduce((acc, doc) => acc + doc.signers.length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-2 border-gray-100 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher un document..."
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="h-12 border-2 border-gray-200">
                  <Calendar className="w-5 h-5 mr-2" />
                  Période
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card className="border-2 border-gray-100 shadow-lg">
            <CardContent className="p-0">
              {documents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArchiveIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">Aucun document archivé</p>
                  <p className="text-sm text-gray-500 mb-6">Les documents complétés apparaîtront ici</p>
                  <Button
                    onClick={() => onNavigate('dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-6 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-green-600" />
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
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Complété
                        </Badge>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
