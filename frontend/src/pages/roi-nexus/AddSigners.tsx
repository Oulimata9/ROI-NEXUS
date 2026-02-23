import { useState } from 'react';
import { UserPlus, Mail, X, ArrowRight, Users, FileText, CheckCircle2, Shield, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
  status: string;
  date: string;
  signers: string[];
}

interface Signer {
  email: string;
  role: 'signer' | 'approver' | 'cc';
  order: number;
}

interface AddSignersProps {
  document: Document | null;
  onNavigate: (page: 'dashboard' | 'upload' | 'sending-confirmation') => void;
  onSendDocument: (signers: string[]) => void;
}

export default function AddSigners({ document, onNavigate, onSendDocument }: AddSignersProps) {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<'signer' | 'approver' | 'cc'>('signer');
  const [error, setError] = useState('');

  const addSigner = () => {
    if (!currentEmail) {
      setError('Veuillez entrer une adresse email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      setError('Adresse email invalide');
      return;
    }
    if (signers.some(s => s.email === currentEmail)) {
      setError('Ce signataire a déjà été ajouté');
      return;
    }
    setSigners([...signers, { 
      email: currentEmail, 
      role: currentRole,
      order: signers.length + 1 
    }]);
    setCurrentEmail('');
    setCurrentRole('signer');
    setError('');
  };

  const removeSigner = (email: string) => {
    const updatedSigners = signers
      .filter(s => s.email !== email)
      .map((s, index) => ({ ...s, order: index + 1 }));
    setSigners(updatedSigners);
  };

  const moveSignerUp = (index: number) => {
    if (index === 0) return;
    const newSigners = [...signers];
    [newSigners[index - 1], newSigners[index]] = [newSigners[index], newSigners[index - 1]];
    newSigners.forEach((s, i) => s.order = i + 1);
    setSigners(newSigners);
  };

  const moveSignerDown = (index: number) => {
    if (index === signers.length - 1) return;
    const newSigners = [...signers];
    [newSigners[index], newSigners[index + 1]] = [newSigners[index + 1], newSigners[index]];
    newSigners.forEach((s, i) => s.order = i + 1);
    setSigners(newSigners);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'signer': return 'Signataire';
      case 'approver': return 'Approbateur';
      case 'cc': return 'En copie';
      default: return role;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'signer':
        return <Badge className="bg-blue-100 text-blue-700 border-0 font-bold">Signataire</Badge>;
      case 'approver':
        return <Badge className="bg-purple-100 text-purple-700 border-0 font-bold">Approbateur</Badge>;
      case 'cc':
        return <Badge className="bg-gray-100 text-gray-700 border-0 font-bold">En copie</Badge>;
      default:
        return null;
    }
  };

  const handleSend = () => {
    const actualSigners = signers.filter(s => s.role === 'signer' || s.role === 'approver');
    if (actualSigners.length === 0) {
      setError('Ajoutez au moins un signataire ou approbateur');
      return;
    }
    onSendDocument(signers.map(s => s.email));
    onNavigate('sending-confirmation');
  };

  const signerCount = signers.filter(s => s.role === 'signer').length;
  const approverCount = signers.filter(s => s.role === 'approver').length;
  const ccCount = signers.filter(s => s.role === 'cc').length;

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
            <div className="flex items-center space-x-3 opacity-50">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600">Document téléchargé</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <span className="font-semibold text-gray-900">Ajouter les signataires</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter les signataires</h1>
            <p className="text-gray-600">Invitez les personnes qui doivent signer le document</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Signer Form */}
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                    Ajouter un signataire
                  </CardTitle>
                  <CardDescription>Entrez l'adresse email du signataire</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email du signataire
                      </Label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="signataire@entreprise.com"
                            className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500"
                            value={currentEmail}
                            onChange={(e) => {
                              setCurrentEmail(e.target.value);
                              setError('');
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && addSigner()}
                          />
                        </div>
                        <Button
                          onClick={addSigner}
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 h-12 px-6"
                        >
                          <UserPlus className="w-5 h-5 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                      {error && (
                        <p className="text-sm text-red-600 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {error}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                        Rôle du signataire
                      </Label>
                      <Select
                        value={currentRole}
                        onValueChange={(value) => setCurrentRole(value as 'signer' | 'approver' | 'cc')}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="signer">Signataire</SelectItem>
                          <SelectItem value="approver">Approbateur</SelectItem>
                          <SelectItem value="cc">En copie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Signers List */}
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Liste des signataires
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      {signers.length} signataire{signers.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {signers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">Aucun signataire ajouté</p>
                      <p className="text-sm text-gray-500 mt-2">Ajoutez au moins un signataire pour continuer</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {signers.map((signer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100 group hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{signer.email}</p>
                              <p className="text-sm text-gray-600">Ordre de signature: {index + 1}</p>
                              {getRoleBadge(signer.role)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => moveSignerUp(index)}
                              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              <ArrowRight className="w-5 h-5 transform rotate-180" />
                            </button>
                            <button
                              onClick={() => moveSignerDown(index)}
                              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => removeSigner(signer.email)}
                              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {signers.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 group"
                    size="lg"
                  >
                    Envoyer pour signature
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>

            {/* Document Info - Right Side */}
            <div className="space-y-6">
              <Card className="border-2 border-gray-100 shadow-lg sticky top-8">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Document
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm break-words">
                            {document?.name || 'Document.pdf'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 text-sm">Informations</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                            En préparation
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Signataires</span>
                          <span className="font-semibold text-gray-900">{signers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span className="font-semibold text-gray-900">
                            {new Date().toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />
                    Conseils
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Les signataires recevront un email avec un lien sécurisé</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>L'ordre de signature sera respecté</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Vous serez notifié à chaque signature</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}