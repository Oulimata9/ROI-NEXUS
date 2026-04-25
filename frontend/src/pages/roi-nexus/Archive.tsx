import { useEffect, useMemo, useState } from 'react';
import { Archive as ArchiveIcon, Calendar, Download, Eye, FileText, LogOut, Plus, Search, Settings as SettingsIcon } from 'lucide-react';

import api from '../../api/axios';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { downloadBlob, getFilenameFromDisposition } from '../../utils/download';

interface ArchivedDocument {
  id_document: number;
  titre: string;
  statut: 'brouillon' | 'en attente' | 'signé' | 'archivé';
  date_creation: string;
  date_envoi?: string;
  id_createur: number;
}

interface ArchiveProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'upload' | 'settings' | 'documents-management' | 'document-detail', documentId?: number) => void;
  onLogout: () => void;
}

export default function Archive({ onNavigate, onLogout }: ArchiveProps) {
  const [documents, setDocuments] = useState<ArchivedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const idEntreprise = localStorage.getItem('id_entreprise');

  useEffect(() => {
    const fetchArchivedDocuments = async () => {
      if (!idEntreprise) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/documents/entreprise/${idEntreprise}`);
        const archivedDocuments = response.data.filter((doc: ArchivedDocument) =>
          doc.statut === 'signé' || doc.statut === 'archivé'
        );
        setDocuments(archivedDocuments);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Impossible de charger les archives.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedDocuments();
  }, [idEntreprise]);

  const filteredDocuments = useMemo(
    () => documents.filter((doc) => doc.titre.toLowerCase().includes(searchTerm.toLowerCase())),
    [documents, searchTerm]
  );

  const archivedThisMonth = useMemo(() => {
    const now = new Date();

    return documents.filter((doc) => {
      const creationDate = new Date(doc.date_creation);
      return creationDate.getMonth() === now.getMonth() && creationDate.getFullYear() === now.getFullYear();
    }).length;
  }, [documents]);

  const handleDownload = async (documentId: number, fallbackFilename: string) => {
    if (!idEntreprise) {
      return;
    }

    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        params: { id_entreprise: idEntreprise },
        responseType: 'blob'
      });

      const filename = getFilenameFromDisposition(response.headers['content-disposition'], fallbackFilename);
      downloadBlob(response.data, filename);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Téléchargement impossible pour ce document.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-sm text-gray-600">Archives entreprise</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <ArchiveIcon className="w-5 h-5" />
              <span>Tableau de bord</span>
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau document</span>
            </button>
            <button
              onClick={() => onNavigate('documents-management')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            >
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

      <div className="ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Archives</h1>
                <p className="text-gray-600">Consultez tous vos documents signés et finalisés</p>
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

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

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
                    <p className="text-3xl font-bold text-gray-900">{archivedThisMonth}</p>
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
                    <p className="text-sm text-gray-600 mb-1 font-medium">Signés</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {documents.filter((doc) => doc.statut === 'signé').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-100 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher un document..."
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 shadow-lg">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-16 text-gray-500">Chargement des archives...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArchiveIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">Aucun document archivé</p>
                  <p className="text-sm text-gray-500 mb-6">Les documents finalisés apparaîtront ici</p>
                  <Button
                    onClick={() => onNavigate('dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id_document}
                      className="flex items-center justify-between p-6 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{doc.titre}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(doc.date_creation).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className={doc.statut === 'archivé' ? 'bg-gray-50 text-gray-700 border-gray-300' : 'bg-green-50 text-green-700 border-green-300'}
                        >
                          {doc.statut === 'archivé' ? 'Archivé' : 'Complété'}
                        </Badge>
                        <div className="flex items-center space-x-2 opacity-100 lg:opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            onClick={() => onNavigate('document-detail', doc.id_document)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-700 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleDownload(doc.id_document, `${doc.titre}.pdf`)}
                          >
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
