import { useState, useEffect } from 'react';
import { Upload, FileText, X, ArrowRight, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import Logo from '../../components/roi-nexus/Logo';
import api from '../../api/axios';
import { AxiosProgressEvent } from 'axios';

interface UploadDocumentProps {
  onNavigate: (page: 'dashboard' | 'add-signers') => void;
  onFileUpload: (file: { name: string; size: number; id?: number }) => void;
}

export default function UploadDocument({ onNavigate, onFileUpload }: UploadDocumentProps) {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; id?: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération des infos de session au montage du composant
  const idEntreprise = localStorage.getItem('id_entreprise');
  const idUser = localStorage.getItem('id_user');
  const userName = localStorage.getItem('user_name');

  const handleFileUploadToServer = async (file: File) => {
  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
formData.append('file', file);

// Conversion explicite en string de nombre pour être sûr
const idEntreprise = localStorage.getItem('id_entreprise');
const idUser = localStorage.getItem('id_user');

if (idEntreprise) formData.append('id_entreprise', idEntreprise); 
if (idUser) formData.append('id_createur', idUser);

  try {
    const response = await api.post('/documents/upload', formData, {
      // 2. Typer explicitement progressEvent
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percentCompleted);
      },
    });

    setIsUploading(false);
    setUploadedFile({ name: file.name, size: file.size });
  } catch (error) {
    setIsUploading(false);
    alert("Erreur lors de l'envoi du document");
  }
};

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUploadToServer(file);
    } else {
      setError("Veuillez sélectionner un fichier PDF valide.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUploadToServer(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleContinue = () => {
    if (uploadedFile) {
      onFileUpload(uploadedFile);
      onNavigate('add-signers');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Logo size="md" variant="dark" />
          </div>
          <div className="p-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              ← Retour au tableau de bord
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
              <span className="font-semibold text-gray-900">Télécharger</span>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">2</div>
              <span className="text-gray-600">Signataires</span>
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Session active</p>
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau document</h1>
            <p className="text-gray-600">L'entreprise enregistrée utilisera l'ID #{idEntreprise}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-3" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <Card className="border-2 border-gray-100 shadow-lg mb-6">
            <CardContent className="p-8">
              {!uploadedFile ? (
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                >
                  {isUploading ? (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="max-w-md mx-auto space-y-3">
                        <p className="text-lg font-semibold text-gray-900">Envoi au serveur Nexus...</p>
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-gray-600">{uploadProgress}%</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Glissez votre PDF ici</h3>
                      <p className="text-gray-500 mb-6">ou cliquez sur le bouton ci-dessous</p>
                      <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                      <Button 
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-blue-600 text-danger-50 hover:bg-blue-700 group"
                      >
                        Sélectionner un fichier
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{uploadedFile.name}</h4>
                        <p className="text-sm text-green-700 font-medium">Prêt pour la signature</p>
                      </div>
                    </div>
                    <button onClick={() => setUploadedFile(null)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleContinue} className="bg-blue-600 text-white group">
                      Continuer
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}