import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import api from './api/axios';
import Archive from './pages/roi-nexus/Archive';
import Dashboard from './pages/roi-nexus/Dashboard';
import DocumentDetail from './pages/roi-nexus/DocumentDetail';
import DocumentsManagement from './pages/roi-nexus/DocumentsManagement';
import LandingPage from './pages/roi-nexus/LandingPage';
import LoginPage from './pages/roi-nexus/LoginPage';
import NexusAdminPage from './pages/roi-nexus/NexusAdminPage';
import SendingConfirmation from './pages/roi-nexus/SendingConfirmation';
import Settings from './pages/roi-nexus/Settings';
import SignatureConfirmation from './pages/roi-nexus/SignatureConfirmation';
import SignaturePage from './pages/roi-nexus/SignaturePage';
import SignedDocument from './pages/roi-nexus/SignedDocument';
import SignUpPage from './pages/roi-nexus/SignUpPage';
import AddSigners from './pages/roi-nexus/AddSigners';
import UploadDocument from './pages/roi-nexus/UploadDocument';
import { AUTH_INVALIDATED_EVENT, clearAuthSession } from './utils/auth';
import { downloadBlob, getFilenameFromDisposition } from './utils/download';

type Page =
  | 'landing'
  | 'signup'
  | 'login'
  | 'dashboard'
  | 'nexus-admin'
  | 'upload'
  | 'add-signers'
  | 'sending-confirmation'
  | 'signature'
  | 'signature-confirmation'
  | 'signed-document'
  | 'archive'
  | 'settings'
  | 'documents-management'
  | 'document-detail';

interface WorkflowDocument {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'completed';
  date: string;
  signers: string[];
}

function getDefaultPrivatePath(role: string) {
  return role === 'admin_nexus' ? '/admin/companies' : '/dashboard';
}

function ProtectedRoute({
  isAuthenticated,
  isAuthChecking,
  currentRole,
  allowedRoles,
  children,
}: {
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  currentRole: string;
  allowedRoles?: string[];
  children: ReactNode;
}) {
  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm font-semibold text-slate-600">
        Verification de la session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    return <Navigate to={getDefaultPrivatePath(currentRole)} replace />;
  }

  return <>{children}</>;
}

function DocumentDetailRoute({
  onNavigate,
  onLogout,
}: {
  onNavigate: (page: Page, documentId?: number) => void;
  onLogout: () => void;
}) {
  const { documentId } = useParams();
  const parsedDocumentId = Number(documentId);

  if (!Number.isFinite(parsedDocumentId) || parsedDocumentId <= 0) {
    return <Navigate to="/documents" replace />;
  }

  return <DocumentDetail documentId={parsedDocumentId} onNavigate={onNavigate} onLogout={onLogout} />;
}

function SignatureSigningRoute({ document }: { document: WorkflowDocument | null }) {
  const navigate = useNavigate();
  const { token = '' } = useParams();

  const navigateFromSignature = (page: 'landing' | 'signature-confirmation') => {
    if (page === 'landing') {
      navigate('/');
      return;
    }

    navigate(`/sign/${token}/confirmation`);
  };

  return <SignaturePage document={document} token={token} onNavigate={navigateFromSignature} />;
}

function SignatureConfirmationRoute() {
  const navigate = useNavigate();
  const { token = '' } = useParams();

  const navigateFromSignatureConfirmation = (page: 'landing' | 'signed-document') => {
    if (page === 'landing') {
      navigate('/');
      return;
    }

    navigate(`/sign/${token}/document`);
  };

  return <SignatureConfirmation onNavigate={navigateFromSignatureConfirmation} />;
}

function SignedDocumentRoute({
  document,
  onDownloadDocument,
}: {
  document: WorkflowDocument | null;
  onDownloadDocument: (token: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const { token = '' } = useParams();

  return (
    <SignedDocument
      document={document}
      token={token}
      onDownloadDocument={() => onDownloadDocument(token)}
      onNavigate={(page) => {
        if (page === 'landing') {
          navigate('/');
        }
      }}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));
  const [isAuthChecking, setIsAuthChecking] = useState(() => Boolean(localStorage.getItem('token')));
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('user_role') || '');
  const [currentDocument, setCurrentDocument] = useState<WorkflowDocument | null>(null);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setCurrentRole('');
          setIsAuthChecking(false);
        }
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (isMounted) {
          setIsAuthenticated(true);
          setCurrentRole(response.data?.role || localStorage.getItem('user_role') || '');
        }
      } catch (err: any) {
        if (isMounted && err.response?.status === 401) {
          setCurrentDocument(null);
          setIsAuthenticated(false);
          setCurrentRole('');
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAuthInvalidated = () => {
      setCurrentDocument(null);
      setIsAuthenticated(false);
      setCurrentRole('');
      setIsAuthChecking(false);
    };

    window.addEventListener(AUTH_INVALIDATED_EVENT, handleAuthInvalidated);

    return () => {
      window.removeEventListener(AUTH_INVALIDATED_EVENT, handleAuthInvalidated);
    };
  }, []);

  const handleLogin = () => {
    const role = localStorage.getItem('user_role') || '';
    setIsAuthenticated(true);
    setCurrentRole(role);
    setIsAuthChecking(false);
    navigate(getDefaultPrivatePath(role));
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentDocument(null);
    setIsAuthenticated(false);
    setCurrentRole('');
    setIsAuthChecking(false);
    navigate('/');
  };

  const navigateTo = (page: Page, documentId?: number) => {
    switch (page) {
      case 'landing':
        navigate('/');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'nexus-admin':
        navigate('/admin/companies');
        break;
      case 'upload':
        navigate('/documents/new');
        break;
      case 'add-signers':
        navigate('/documents/new/signers');
        break;
      case 'sending-confirmation':
        navigate('/documents/sent');
        break;
      case 'archive':
        navigate('/archive');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'documents-management':
        navigate('/documents');
        break;
      case 'document-detail':
        navigate(documentId ? `/documents/${documentId}` : '/documents');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleFileUpload = (file: { name: string; size: number; id?: number; date?: string }) => {
    setCurrentDocument({
      id: String(file.id ?? Date.now()),
      name: file.name,
      status: 'pending',
      date: file.date ? new Date(file.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      signers: [],
    });
  };

  const handleSendDocument = (signers: string[]) => {
    setCurrentDocument((previousDocument) => (previousDocument ? { ...previousDocument, signers } : previousDocument));
  };

  const handleSignatureDownload = async (token: string) => {
    if (!token) {
      return;
    }

    const response = await api.get(`/signatures/download/${token}`, {
      responseType: 'blob',
    });

    const filename = getFilenameFromDisposition(response.headers['content-disposition'], 'document-signe.pdf');
    downloadBlob(response.data, filename);
  };

  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm font-semibold text-slate-600">
        Verification de la session...
      </div>
    );
  }

  const privatePath = getDefaultPrivatePath(currentRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={navigateTo} />} />
        <Route path="/signup" element={<SignUpPage onNavigate={navigateTo} />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={privatePath} replace />
            ) : (
              <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />
            )
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['admin_nexus']}
            >
              <NexusAdminPage onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <Dashboard onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/new"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <UploadDocument onNavigate={navigateTo} onFileUpload={handleFileUpload} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/new/signers"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              {currentDocument ? (
                <AddSigners document={currentDocument} onNavigate={navigateTo} onSendDocument={handleSendDocument} />
              ) : (
                <Navigate to="/documents/new" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/sent"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <SendingConfirmation onNavigate={navigateTo} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <Archive onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <Settings onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <DocumentsManagement onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:documentId"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAuthChecking={isAuthChecking}
              currentRole={currentRole}
              allowedRoles={['administrateur', 'utilisateur']}
            >
              <DocumentDetailRoute onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/sign/:token" element={<SignatureSigningRoute document={currentDocument} />} />
        <Route path="/sign/:token/confirmation" element={<SignatureConfirmationRoute />} />
        <Route
          path="/sign/:token/document"
          element={<SignedDocumentRoute document={currentDocument} onDownloadDocument={handleSignatureDownload} />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? privatePath : '/'} replace />} />
      </Routes>
    </div>
  );
}
