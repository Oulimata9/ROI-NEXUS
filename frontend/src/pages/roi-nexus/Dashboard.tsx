import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Archive, Settings, LogOut, Clock, 
  CheckCircle2, AlertCircle, TrendingUp, Users, 
  Download, Search, Filter, Calendar, BarChart3, Eye 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

// Interface pour correspondre aux données du Backend
interface Document {
  id_document: number;
  titre: string;
  statut: 'en attente' | 'signé' | 'archivé' | 'brouillon';
  date_creation: string;
  id_createur: number;
}

interface DashboardProps {
  onNavigate: (page: 'landing' | 'upload' | 'archive' | 'settings' | 'documents-management' | 'document-detail', documentId?: number) => void;
  onLogout: () => void;
}

export default function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupération des infos de session
  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const idEntreprise = localStorage.getItem('id_entreprise');

  // Chargement des données réelles au montage du composant
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        // On récupère les documents filtrés par entreprise
        const response = await api.get(`/documents/entreprise/${idEntreprise}`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (idEntreprise) {
      fetchDocuments();
    }
  }, [idEntreprise]);

  // Calculs dynamiques basés sur les vraies données
  const totalCount = documents.length;
  const signedCount = documents.filter(d => d.statut === 'signé').length;
  const pendingCount = documents.filter(d => d.statut === 'en attente').length;
  const completionRate = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  // Filtrage pour la recherche
  const filteredDocuments = documents.filter(doc => 
    doc.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
            <BarChart3 className="mr-3 w-5 h-5" /> Vue d'ensemble
          </Button>
          <Button onClick={() => onNavigate('documents-management')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <FileText className="mr-3 w-5 h-5" /> Gérer mes documents
          </Button>
          <Button onClick={() => onNavigate('upload')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <Plus className="mr-3 w-5 h-5" /> Nouveau document
          </Button>
          <Button onClick={() => onNavigate('archive')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <Archive className="mr-3 w-5 h-5" /> Archives
          </Button>
          <Button onClick={() => onNavigate('settings')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <Settings className="mr-3 w-5 h-5" /> Paramètres
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Compte</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500">ID Entreprise: {idEntreprise}</p>
              </div>
            </div>
          </div>
          <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
            <LogOut className="mr-3 w-5 h-5" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bonjour, {userName} 👋</h1>
              <p className="text-gray-600">Voici l'activité de vos documents aujourd'hui.</p>
            </div>
            <Button 
              onClick={() => onNavigate('upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
            >
              <Plus className="mr-2 w-5 h-5" /> Nouveau document
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg"><FileText className="text-blue-600" /></div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">Total</Badge>
                </div>
                <h3 className="text-2xl font-bold">{totalCount}</h3>
                <p className="text-sm text-gray-500">Documents créés</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-50 rounded-lg"><Clock className="text-yellow-600" /></div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">En attente</Badge>
                </div>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
                <p className="text-sm text-gray-500">Besoin d'action</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 rounded-lg"><CheckCircle2 className="text-green-600" /></div>
                  <Badge variant="outline" className="text-green-600 border-green-200">Signés</Badge>
                </div>
                <h3 className="text-2xl font-bold">{signedCount}</h3>
                <p className="text-sm text-gray-500">Documents complétés</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg"><TrendingUp className="text-white" /></div>
                </div>
                <h3 className="text-2xl font-bold">{completionRate}%</h3>
                <p className="text-sm text-blue-100">Taux de signature</p>
                <Progress value={completionRate} className="h-1.5 mt-4 bg-white/20" />
              </CardContent>
            </Card>
          </div>

          {/* Documents Table */}
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-xl">Documents récents</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Rechercher un fichier..." 
                      className="pl-10 h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-12 text-center text-gray-500">Chargement de vos documents...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Aucun document trouvé.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Nom du document</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id_document} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                <FileText className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-gray-900">{doc.titre}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={
                              doc.statut === 'signé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }>
                              {doc.statut}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(doc.date_creation).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => onNavigate('document-detail', doc.id_document)}>
                              <Eye className="w-4 h-4 mr-2" /> Voir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
