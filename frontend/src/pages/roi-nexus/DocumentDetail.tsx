import { useState, useEffect } from 'react';
import {
  ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle, Download, Bell,
  History, MoreVertical, LogOut, BarChart3, Settings, Plus, Archive
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';

interface Signature {
  id_signature: number;
  email_signataire: string;
  etat_signature: 'signé' | 'en attente';
  date_signature?: string;
}

interface Document {
  id_document: number;
  titre: string;
  statut: 'brouillon' | 'en attente' | 'signé' | 'archivé';
  date_creation: string;
  date_envoi?: string;
  id_createur: number;
  signatures: Signature[];
}

interface DocumentDetailProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  documentId: number;
}

export default function DocumentDetail({ onNavigate, onLogout, documentId }: DocumentDetailProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [reminderSent, setReminderSent] = useState('');

  const userName = localStorage.getItem('user_name') || 'Utilisateur';
  const idEntreprise = localStorage.getItem('id_entreprise');

  useEffect(() => {
    fetchDocumentDetail();
  }, [documentId]);

  const fetchDocumentDetail = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/documents/${documentId}/detail`, {
        params: { id_entreprise: idEntreprise }
      });
      setDocument(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSign = async () => {
    try {
      setError('');
      const response = await api.post(`/documents/${documentId}/sign`, new FormData(), {
        params: { id_entreprise: idEntreprise }
      });
      
      if (response.data.status === 'success') {
        fetchDocumentDetail();
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la signature');
    }
  };

  const handleSendReminder = async (idSignature: number) => {
    try {
      setError('');
      await api.post(`/documents/${documentId}/remind`, new FormData(), {
        params: {
          id_entreprise: idEntreprise,
          id_signature: idSignature
        }
      });
      setReminderSent(`Rappel envoyé`);
      setTimeout(() => setReminderSent(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'envoi du rappel');
    }
  };

  const handleDownload = async () => {
    try {
      setError('');
      const response = await api.get(`/documents/${documentId}/download`, {
        params: { id_entreprise: idEntreprise }
      });
      
      // Redirect to download or implement download logic
      window.location.href = `/api${response.config.url}`;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du téléchargement');
    }
  };

  const signatureProgress = document ? 
    (document.signatures.filter(s => s.etat_signature === 'signé').length / document.signatures.length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-gray-100">
            <Logo size="md" variant="dark" />
          </div>
          <div className="flex-1" />
          <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 m-4">
            <LogOut className="mr-3 w-5 h-5" /> Déconnexion
          </Button>
        </aside>
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error || 'Document non trouvé'}</p>
            <Button onClick={() => onNavigate('documents-management')} className="mt-4">
              Retour aux documents
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusColor = (statut: string) => {
    const colors: Record<string, string> = {
      'brouillon': 'bg-blue-50 text-blue-600 border-blue-200',
      'en attente': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'signé': 'bg-green-50 text-green-600 border-green-200',
      'archivé': 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return colors[statut] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Logo size="md" variant="dark" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button onClick={() => onNavigate('dashboard')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-blue-600">
            <BarChart3 className="mr-3 w-5 h-5" /> Vue d'ensemble
          </Button>
          <Button onClick={() => onNavigate('documents-management')} variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50">
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => onNavigate('documents-management')} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Détails du document</h1>
              <p className="text-gray-500 mt-1">Consultez l'état et les signatures</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {reminderSent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-600">{reminderSent}</p>
            </div>
          )}

          {/* Document Info Card */}
          <Card className="mb-8">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{document.titre}</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Créé le {new Date(document.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(document.statut)}`}>
                  {document.statut}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">{document.statut}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Signatures</p>
                  <p className="font-semibold text-gray-900">
                    {document.signatures.filter(s => s.etat_signature === 'signé').length}/{document.signatures.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Progression</p>
                  <Progress value={signatureProgress} className="h-2 mt-2" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Actions</p>
                  <div className="flex gap-2">
                    {document.statut === 'signé' && (
                      <Button onClick={handleDownload} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button onClick={() => setShowHistory(!showHistory)} size="sm" variant="outline">
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signatures Table */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <CardTitle>Signataires</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {document.signatures.map((sig) => (
                      <tr key={sig.id_signature} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{sig.email_signataire}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={
                            sig.etat_signature === 'signé'
                              ? 'bg-green-50 text-green-600 border-green-200 flex items-center gap-1 w-fit'
                              : 'bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1 w-fit'
                          }>
                            {sig.etat_signature === 'signé' 
                              ? <CheckCircle2 className="w-4 h-4" />
                              : <Clock className="w-4 h-4" />
                            }
                            {sig.etat_signature}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {sig.date_signature 
                            ? new Date(sig.date_signature).toLocaleDateString('fr-FR')
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          {sig.etat_signature === 'en attente' && (
                            <Button
                              onClick={() => handleSendReminder(sig.id_signature)}
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Bell className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <CardTitle>Actions administrateur</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {document.statut !== 'signé' && (
                  <Button
                    onClick={handleAdminSign}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle2 className="mr-2 w-4 h-4" /> Signer maintenant
                  </Button>
                )}
                {document.statut === 'signé' && (
                  <Button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 w-4 h-4" /> Télécharger
                  </Button>
                )}
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                >
                  <History className="mr-2 w-4 h-4" /> Historique
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {showHistory && (
            <Card className="mb-8">
              <CardHeader className="border-b">
                <CardTitle>Historique complet</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Document créé</p>
                      <p className="text-sm text-gray-600">{new Date(document.date_creation).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  {document.date_envoi && (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Envoyé pour signature</p>
                        <p className="text-sm text-gray-600">{new Date(document.date_envoi).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  )}
                  {document.signatures.filter(s => s.etat_signature === 'signé').map((sig) => (
                    <div key={sig.id_signature} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Signé par {sig.email_signataire}</p>
                        <p className="text-sm text-gray-600">
                          {sig.date_signature 
                            ? new Date(sig.date_signature).toLocaleDateString('fr-FR')
                            : ''
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
