import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  LogOut,
  Mail,
  Shield,
  User,
  Users,
} from 'lucide-react';

import api from '../../api/axios';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface RegisteredCompany {
  id_entreprise: number;
  nom_entreprise: string;
  email_contact: string;
  statut: string;
  date_creation: string;
  admin_id: number;
  admin_nom: string;
  admin_email: string;
  admin_role: string;
}

interface NexusAdminPageProps {
  onNavigate: (page: 'landing') => void;
  onLogout: () => void;
}

export default function NexusAdminPage({ onNavigate, onLogout }: NexusAdminPageProps) {
  const [companies, setCompanies] = useState<RegisteredCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
  });

  const userName = localStorage.getItem('user_name') || 'Admin Nexus';

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<RegisteredCompany[]>('/entreprises/admin');
      setCompanies(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Impossible de charger les entreprises.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCompanies();
  }, []);

  const activeCompaniesCount = useMemo(
    () => companies.filter((company) => company.statut === 'actif').length,
    [companies]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedCompanyName = formData.companyName.trim();
    const trimmedContactEmail = formData.contactEmail.trim();
    const trimmedAdminName = formData.adminName.trim();
    const trimmedAdminEmail = formData.adminEmail.trim();

    if (!trimmedCompanyName || !trimmedContactEmail || !trimmedAdminName || !trimmedAdminEmail || !formData.password) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe initial doit contenir au moins 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<RegisteredCompany>('/auth/admin/register-company', {
        nom_entreprise: trimmedCompanyName,
        email_contact: trimmedContactEmail,
        nom_admin: trimmedAdminName,
        email_admin: trimmedAdminEmail,
        mot_de_passe: formData.password,
      });

      setCompanies((previousCompanies) => [response.data, ...previousCompanies]);
      setFormData({
        companyName: '',
        contactEmail: '',
        adminName: '',
        adminEmail: '',
        password: '',
        confirmPassword: '',
      });
      setSuccessMessage(
        `Entreprise creee: ${response.data.nom_entreprise}. L'admin ${response.data.admin_nom} peut maintenant se connecter.`
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || "Impossible de creer l'entreprise.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/60">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-6">
            <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Admin Nexus</p>
              <h1 className="mt-2 text-2xl font-black text-slate-950">Creation des entreprises</h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                Cet espace sert a ouvrir les comptes des nouvelles entreprises et de leurs administrateurs.
              </p>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Vue rapide</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-600">Entreprises actives</span>
                    <span className="text-lg font-black text-slate-950">{activeCompaniesCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-600">Total comptes ouverts</span>
                    <span className="text-lg font-black text-slate-950">{companies.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto p-6">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Session</p>
              <p className="mt-2 text-base font-bold text-slate-950">{userName}</p>
              <p className="text-sm text-slate-500">Role: Admin Nexus</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="w-full justify-start border-slate-300 text-red-600">
              <LogOut className="mr-2 h-5 w-5" />
              Deconnexion
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 xl:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Maintenance du systeme</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Inscrire une nouvelle entreprise</h2>
                <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
                  Vous creez ici l'entreprise, son email de contact et le compte de son administrateur. L'entreprise n'aura
                  plus qu'a se connecter ensuite.
                </p>
              </div>
              <Badge className="w-fit border-0 bg-emerald-100 px-4 py-2 text-emerald-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Comptes entreprises geres par Admin Nexus
              </Badge>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-relaxed">{successMessage}</p>
              </div>
            )}

            <div className="space-y-8">
              <Card className="min-w-0 border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center text-xl text-slate-950">
                    <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                    Formulaire de creation
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations de l'entreprise et le premier compte administrateur.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="company-name">Nom de l'entreprise</Label>
                      <div className="relative min-w-0">
                        <Building2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="company-name"
                          className="h-14 rounded-2xl border-slate-200 pl-14 pr-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                          placeholder="Ex: Senelec, Sonatel, AfriTrans..."
                          value={formData.companyName}
                          onChange={(event) => setFormData({ ...formData, companyName: event.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="contact-email">Email de contact entreprise</Label>
                      <div className="relative min-w-0">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="contact-email"
                          type="email"
                          className="h-14 rounded-2xl border-slate-200 pl-14 pr-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                          placeholder="contact@entreprise.com"
                          value={formData.contactEmail}
                          onChange={(event) => setFormData({ ...formData, contactEmail: event.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Nom de l'administrateur</Label>
                      <div className="relative min-w-0">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="admin-name"
                          className="h-14 rounded-2xl border-slate-200 pl-14 pr-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                          placeholder="Nom complet"
                          value={formData.adminName}
                          onChange={(event) => setFormData({ ...formData, adminName: event.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email administrateur</Label>
                      <div className="relative min-w-0">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="admin-email"
                          type="email"
                          className="h-14 rounded-2xl border-slate-200 pl-14 pr-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                          placeholder="admin@entreprise.com"
                          value={formData.adminEmail}
                          onChange={(event) => setFormData({ ...formData, adminEmail: event.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Mot de passe initial</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        className="h-14 rounded-2xl border-slate-200 px-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                        placeholder="Minimum 8 caracteres"
                        value={formData.password}
                        onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password-confirm">Confirmer le mot de passe</Label>
                      <Input
                        id="admin-password-confirm"
                        type="password"
                        className="h-14 rounded-2xl border-slate-200 px-4 text-base placeholder:text-slate-400 focus:border-blue-500"
                        placeholder="Retapez le mot de passe"
                        value={formData.confirmPassword}
                        onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:from-slate-950 hover:via-blue-700 hover:to-cyan-600"
                      >
                        {isSubmitting ? 'Creation en cours...' : "Creer l'entreprise"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="min-w-0 border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl text-slate-950">
                        <Users className="mr-2 h-5 w-5 text-blue-600" />
                        Entreprises enregistrees
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Vue compacte des entreprises deja ouvertes dans la plateforme.
                      </CardDescription>
                    </div>
                    <Badge className="w-fit border-0 bg-slate-100 px-3 py-1.5 text-slate-700">
                      {companies.length} entreprise{companies.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="rounded-b-2xl bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-500">
                      Chargement des entreprises...
                    </div>
                  ) : companies.length === 0 ? (
                    <div className="rounded-b-2xl bg-slate-50 px-5 py-10 text-center">
                      <Building2 className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-4 text-sm font-semibold text-slate-600">Aucune entreprise creee pour le moment.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            <th className="px-6 py-4">Entreprise</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Admin</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Creation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {companies.map((company) => (
                            <tr key={company.id_entreprise} className="transition hover:bg-blue-50/40">
                              <td className="px-6 py-4 align-top">
                                <div className="min-w-[200px]">
                                  <p className="font-bold text-slate-950">{company.nom_entreprise}</p>
                                  <p className="mt-1 text-xs font-medium text-slate-500">ID #{company.id_entreprise}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <p className="min-w-[220px] break-all text-sm font-medium text-slate-600">
                                  {company.email_contact}
                                </p>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <div className="min-w-[220px]">
                                  <p className="font-semibold text-slate-900">{company.admin_nom}</p>
                                  <p className="mt-1 break-all text-sm text-slate-500">{company.admin_email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <Badge className="border-0 bg-emerald-100 text-emerald-700">{company.statut}</Badge>
                              </td>
                              <td className="px-6 py-4 align-top text-sm font-medium text-slate-500">
                                {new Date(company.date_creation).toLocaleDateString('fr-FR')}
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
          </div>
        </main>
      </div>
    </div>
  );
}
