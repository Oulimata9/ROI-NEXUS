import { useState } from 'react';
import { Upload, FileText, X, ArrowRight, File, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import Logo from '../../components/roi-nexus/Logo';

interface UploadDocumentProps {
  onNavigate: (page: 'dashboard' | 'add-signers') => void;
  onFileUpload: (file: { name: string; size: number }) => void;
}

export default function UploadDocument({ onNavigate, onFileUpload }: UploadDocumentProps) {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      simulateUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile({ name: file.name, size: file.size });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
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

          {/* Upload Steps */}
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                1
              </div>
              <span className="font-semibold text-gray-900">Télécharger le document</span>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                2
              </div>
              <span className="text-gray-600">Ajouter les signataires</span>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                3
              </div>
              <span className="text-gray-600">Envoyer pour signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Télécharger un document</h1>
            <p className="text-gray-600">Importez le document PDF que vous souhaitez faire signer</p>
          </div>

          {/* Upload Area */}
          <Card className="border-2 border-gray-100 shadow-lg mb-6">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Sélectionnez votre document</CardTitle>
              <CardDescription>Formats acceptés : PDF • Taille maximale : 10 MB</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {!uploadedFile ? (
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                >
                  {isUploading ? (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="max-w-md mx-auto space-y-3">
                        <p className="text-lg font-semibold text-gray-900">Téléchargement en cours...</p>
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-gray-600">{uploadProgress}%</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Glissez-déposez votre document ici
                      </h3>
                      <p className="text-gray-600 mb-6">ou</p>
                      <label htmlFor="file-upload">
                        <Button
                          type="button"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer shadow-lg shadow-blue-500/30"
                          size="lg"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Parcourir les fichiers
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <p className="text-sm text-gray-500 mt-6">Formats acceptés : PDF • Max 10 MB</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Preview */}
                  <div className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</h4>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)} • PDF</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <File className="w-5 h-5 mr-2 text-blue-600" />
                        Aperçu du document
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12">
                        <div className="aspect-[3/4] bg-white rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-200 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-blue-600 to-indigo-600" />
                          <div className="text-center p-8 z-10">
                            <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium mb-2">Aperçu du document PDF</p>
                            <p className="text-sm text-gray-500 max-w-md">
                              Votre document sera affiché ici lors de la signature
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Continue Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleContinue}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 group"
                      size="lg"
                    >
                      Continuer vers les signataires
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Sécurisé</p>
                    <p className="text-xs text-gray-600">Chiffrement de bout en bout</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Rapide</p>
                    <p className="text-xs text-gray-600">Téléchargement instantané</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Conforme</p>
                    <p className="text-xs text-gray-600">Normes internationales</p>
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
