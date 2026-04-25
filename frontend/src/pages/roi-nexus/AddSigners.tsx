import { useState } from 'react';
import { ArrowRight, CheckCircle2, FileText, Loader2, Mail, UserPlus, Users, X } from 'lucide-react';

import api from '../../api/axios';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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

type SignatureType = 'draw' | 'numerique_otp';

interface AddSignersProps {
  document: Document | null;
  onNavigate: (page: 'landing' | 'dashboard' | 'upload' | 'sending-confirmation') => void;
  onSendDocument: (signers: string[]) => void;
}

export default function AddSigners({ document, onNavigate, onSendDocument }: AddSignersProps) {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<'signer' | 'approver' | 'cc'>('signer');
  const [signatureType, setSignatureType] = useState<SignatureType>('draw');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const addSigner = () => {
    if (!currentEmail) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      setError('Adresse email invalide');
      return;
    }

    if (signers.some((signer) => signer.email === currentEmail)) {
      setError('Ce signataire a deja ete ajoute');
      return;
    }

    setSigners([
      ...signers,
      {
        email: currentEmail,
        role: currentRole,
        order: signers.length + 1,
      },
    ]);
    setCurrentEmail('');
    setCurrentRole('signer');
    setError('');
  };

  const removeSigner = (email: string) => {
    const updatedSigners = signers
      .filter((signer) => signer.email !== email)
      .map((signer, index) => ({ ...signer, order: index + 1 }));

    setSigners(updatedSigners);
  };

  const moveSignerUp = (index: number) => {
    if (index === 0) {
      return;
    }

    const nextSigners = [...signers];
    [nextSigners[index - 1], nextSigners[index]] = [nextSigners[index], nextSigners[index - 1]];
    nextSigners.forEach((signer, signerIndex) => {
      signer.order = signerIndex + 1;
    });
    setSigners(nextSigners);
  };

  const moveSignerDown = (index: number) => {
    if (index === signers.length - 1) {
      return;
    }

    const nextSigners = [...signers];
    [nextSigners[index], nextSigners[index + 1]] = [nextSigners[index + 1], nextSigners[index]];
    nextSigners.forEach((signer, signerIndex) => {
      signer.order = signerIndex + 1;
    });
    setSigners(nextSigners);
  };

  const getRoleBadge = (role: Signer['role']) => {
    switch (role) {
      case 'signer':
        return <Badge className="border-0 bg-blue-100 text-blue-700 font-bold">Signataire</Badge>;
      case 'approver':
        return <Badge className="border-0 bg-purple-100 text-purple-700 font-bold">Approbateur</Badge>;
      case 'cc':
        return <Badge className="border-0 bg-gray-100 text-gray-700 font-bold">En copie</Badge>;
      default:
        return null;
    }
  };

  const handleSend = async () => {
    const actualSigners = signers.filter((signer) => signer.role === 'signer' || signer.role === 'approver');

    if (actualSigners.length === 0) {
      setError('Ajoutez au moins un signataire ou approbateur');
      return;
    }

    if (!document?.id) {
      setError('Erreur : aucun document selectionne');
      return;
    }

    setIsSending(true);
    try {
      for (const signer of actualSigners) {
        await api.post(`/signatures/invite/${document.id}`, null, {
          params: {
            email_signataire: signer.email,
            signature_type: signatureType,
          },
        });
      }

      onSendDocument(actualSigners.map((signer) => signer.email));
      onNavigate('sending-confirmation');
    } catch (err: any) {
      console.error("Erreur lors de l'envoi des invitations", err);
      const backendDetail =
        typeof err?.response?.data?.detail === 'string'
          ? err.response.data.detail
          : '';
      setError(
        backendDetail || "Le serveur n'a pas pu envoyer les invitations. Verifiez la connexion au backend."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="fixed inset-y-0 left-0 w-72 border-r border-gray-200 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-6">
            <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
          </div>

          <div className="p-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Retour au tableau de bord
            </button>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center space-x-3 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-600">Document telecharge</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-semibold text-white">
                2
              </div>
              <span className="font-semibold text-gray-900">Ajouter les signataires</span>
            </div>

            <div className="flex items-center space-x-3 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                3
              </div>
              <span className="text-gray-600">Envoyer pour signature</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-72 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Ajouter les signataires</h1>
            <p className="text-gray-600">Invitez les personnes qui doivent signer le document</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
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
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="signataire@entreprise.com"
                            className="h-12 border-2 border-gray-200 pl-10 focus:border-blue-500"
                            value={currentEmail}
                            onChange={(event) => {
                              setCurrentEmail(event.target.value);
                              setError('');
                            }}
                            onKeyPress={(event) => {
                              if (event.key === 'Enter') {
                                addSigner();
                              }
                            }}
                          />
                        </div>

                        <Button
                          onClick={addSigner}
                          className="h-12 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-600"
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          Ajouter
                        </Button>
                      </div>

                      {error && (
                        <p className="flex items-center text-sm text-red-600">
                          <X className="mr-1 h-4 w-4" />
                          {error}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                        Role du signataire
                      </Label>
                      <Select
                        value={currentRole}
                        onValueChange={(value) => setCurrentRole(value as 'signer' | 'approver' | 'cc')}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Selectionnez un role" />
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

              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      Liste des signataires
                    </div>
                    <Badge className="border-0 bg-blue-100 text-blue-700">
                      {signers.length} signataire{signers.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  {signers.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-600">Aucun signataire ajoute</p>
                      <p className="mt-2 text-sm text-gray-500">Ajoutez au moins un signataire pour continuer</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {signers.map((signer, index) => (
                        <div
                          key={`${signer.email}-${index}`}
                          className="group flex items-center justify-between rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 transition-all hover:border-blue-300"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white">
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
                              className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 opacity-100 shadow-sm transition-colors hover:bg-gray-100 lg:opacity-70 group-hover:opacity-100"
                            >
                              <ArrowRight className="mx-auto h-5 w-5 rotate-180 transform" />
                            </button>
                            <button
                              onClick={() => moveSignerDown(index)}
                              className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 opacity-100 shadow-sm transition-colors hover:bg-gray-100 lg:opacity-70 group-hover:opacity-100"
                            >
                              <ArrowRight className="mx-auto h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeSigner(signer.email)}
                              className="h-9 w-9 rounded-lg border border-red-100 bg-white text-red-500 opacity-100 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 lg:opacity-70 group-hover:opacity-100"
                            >
                              <X className="mx-auto h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                    Definir le type de signature
                  </CardTitle>
                  <CardDescription>
                    Choisissez le parcours qui sera impose a tous les signataires de ce document.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSignatureType('draw')}
                      className={`rounded-2xl border-2 p-5 text-left transition-all ${
                        signatureType === 'draw'
                          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                          : 'border-gray-200 bg-white hover:border-blue-200'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">Signature par dessin</span>
                        <Badge className="border-0 bg-blue-100 text-blue-700">Canvas</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Le signataire dessine sa signature ou importe une image avant validation.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignatureType('numerique_otp')}
                      className={`rounded-2xl border-2 p-5 text-left transition-all ${
                        signatureType === 'numerique_otp'
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                          : 'border-gray-200 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">Signature numerique avec OTP</span>
                        <Badge className="border-0 bg-emerald-100 text-emerald-700">OTP email</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Le signataire saisit son nom, demande un code OTP puis valide avec ce code.
                      </p>
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Type actif:{' '}
                    <span className="font-semibold text-slate-900">
                      {signatureType === 'draw' ? 'Signature par dessin' : 'Signature numerique avec OTP'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {signers.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSend}
                    disabled={isSending}
                    className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-600"
                    size="lg"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer pour signature
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="sticky top-8 border-2 border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Document
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                      <div className="mb-3 flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="break-words text-sm font-semibold text-gray-900">
                            {document?.name || 'Document.pdf'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Badge className="border border-slate-200 bg-white text-slate-700">
                          {signatureType === 'draw' ? 'Signature par dessin' : 'Signature numerique avec OTP'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
