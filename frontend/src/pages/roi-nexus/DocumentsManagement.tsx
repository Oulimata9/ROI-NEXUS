import { useState, useEffect } from 'react';
import {
  FileText, Plus, Archive, Trash2, Edit2, X, Search, AlertCircle,
  CheckCircle2, Clock, LogOut, BarChart3, Settings
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';

interface Document {
  id_document: number;
  titre: string;
  statut: 'brouillon' | 'en attente' | 'signé' | 'archivé';
  date_creation: string;
  id_createur: number;
}

interface DocumentsManagementProps {
  onNavigate: (page: 'landing' | 'dashboard' | 'upload' | 'archive' | 'settings' | 'document-detail', documentId?: number) => void;
  onLogout: () => void;
}

export default function DocumentsManagement({ onNavigate, onLogout }: DocumentsManagementProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Form states
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Récupération des infos de session
  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const idEntreprise = localStorage.getItem('id_entreprise');
  const idCreator = localStorage.getItem('id_user');

  // Chargement des documents
  useEffect(() => {
    fetchDocuments();
  }, [idEntreprise]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/documents/entreprise/${idEntreprise}`);
      setDocuments(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un document
  const handleAddDocument = async () => {
    if (!selectedFile || !idEntreprise || !idCreator) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      setError('');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('id_entreprise', idEntreprise);
      formData.append('id_createur', idCreator);

      await api.post('/documents/upload', formData);
      setSuccess('Document ajouté avec succès');
      setShowAddModal(false);
      setSelectedFile(null);
      setTimeout(() => {
        fetchDocuments();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'ajout du document');
    }
  };

  // Modifier le titre
  const handleEditDocument = async () => {
    if (!selectedDocument || !newTitle.trim() || !idEntreprise) {
      setError('Veuillez entrer un titre valide');
      return;
    }

    try {
      setError('');
      const formData = new FormData();
      formData.append('titre', newTitle);
      formData.append('id_entreprise', idEntreprise);

      await api.patch(`/documents/${selectedDocument.id_document}`, formData);
      setSuccess('Document modifié avec succès');
      setShowEditModal(false);
      setNewTitle('');
      setSelectedDocument(null);
      setTimeout(() => {
        fetchDocuments();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la modification');
    }
  };

  // Supprimer un document
  const handleDeleteDocument = async () => {
    if (!selectedDocument || !idEntreprise) return;

    try {
      setError('');
      await api.delete(`/documents/${selectedDocument.id_document}`, {
        params: { id_entreprise: idEntreprise }
      });
      setSuccess('Document supprimé avec succès');
      setShowDeleteModal(false);
      setTimeout(() => {
        fetchDocuments();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la suppression');
    }
  };

  // Archiver un document
  const handleArchiveDocument = async () => {
    if (!selectedDocument || !idEntreprise) return;

    try {
      setError('');
      const formData = new FormData();
      formData.append('id_entreprise', idEntreprise);

      await api.patch(`/documents/${selectedDocument.id_document}/archive`, formData);
      setSuccess('Document archivé avec succès');
      setShowArchiveModal(false);
      setTimeout(() => {
        fetchDocuments();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'archivage');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helpers pour les statuts
  const getStatusColor = (statut: string) => {
    const colors: Record<string, string> = {
      'brouillon': 'bg-blue-50 text-blue-600 border-blue-200',
      'en attente': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'signé': 'bg-green-50 text-green-600 border-green-200',
      'archivé': 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colors[statut] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'brouillon':
        return <Clock className="w-4 h-4" />;
      case 'en attente':
        return <AlertCircle className="w-4 h-4" />;
      case 'signé':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'archivé':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button onClick={() => onNavigate('dashboard')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <BarChart3 className="mr-3 w-5 h-5" /> Vue d'ensemble
          </Button>
          <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
            <FileText className="mr-3 w-5 h-5" /> Gérer documents
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
                <p className="text-xs text-gray-500">Admin Entreprise</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des documents</h1>
            <p className="text-gray-600">Gérez vos documents via les actions disponibles</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            >
              <Plus className="mr-2 w-5 h-5" /> Ajouter document
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="border-b bg-white">
              <CardTitle>Tous les documents ({filteredDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-12 text-center text-gray-500">Chargement des documents...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun document trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          Titre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                          Date création
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id_document} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-gray-900">{doc.titre}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(doc.statut)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(doc.statut)}
                              {doc.statut}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(doc.date_creation).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setNewTitle(doc.titre);
                                  setShowEditModal(true);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                disabled={doc.statut === 'signé' || doc.statut === 'archivé'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowArchiveModal(true);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                disabled={doc.statut === 'archivé'}
                              >
                                <Archive className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowDeleteModal(true);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={doc.statut === 'signé' || doc.statut === 'archivé'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

      {/* Modal: Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="border-b flex flex-row justify-between items-center">
              <CardTitle>Ajouter un document</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFile(null);
                  setError('');
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Fichier PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {selectedFile.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedFile(null);
                      setError('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddDocument}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Modifier */}
      {showEditModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="border-b flex flex-row justify-between items-center">
              <CardTitle>Modifier le document</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDocument(null);
                  setNewTitle('');
                  setError('');
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nouveau titre
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Entrez le nouveau titre..."
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDocument(null);
                      setNewTitle('');
                      setError('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleEditDocument}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Supprimer */}
      {showDeleteModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="border-b">
              <CardTitle className="text-red-600">Supprimer le document?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-600">
                  Voulez-vous supprimer définitivement le document <strong>"{selectedDocument.titre}"</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDocument(null);
                    setError('');
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteDocument}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Archiver */}
      {showArchiveModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="border-b">
              <CardTitle>Archiver le document?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-600">
                  Archiver <strong>"{selectedDocument.titre}"</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Le document sera conservé mais ne sera plus actif.</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowArchiveModal(false);
                    setSelectedDocument(null);
                    setError('');
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleArchiveDocument}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Archiver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
