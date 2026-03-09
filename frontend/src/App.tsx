import { useState } from 'react';
import LandingPage from './pages/roi-nexus/LandingPage';
import SignUpPage from './pages/roi-nexus/SignUpPage';
import LoginPage from './pages/roi-nexus/LoginPage';
import Dashboard from './pages/roi-nexus/Dashboard';
import UploadDocument from './pages/roi-nexus/UploadDocument';
import AddSigners from './pages/roi-nexus/AddSigners';
import SendingConfirmation from './pages/roi-nexus/SendingConfirmation';
import SignaturePage from './pages/roi-nexus/SignaturePage';
import SignatureConfirmation from './pages/roi-nexus/SignatureConfirmation';
import SignedDocument from './pages/roi-nexus/SignedDocument';
import Archive from './pages/roi-nexus/Archive';
import Settings from './pages/roi-nexus/Settings';
import DocumentsManagement from './pages/roi-nexus/DocumentsManagement';
import DocumentDetail from './pages/roi-nexus/DocumentDetail';

type Page = 
  | 'landing'
  | 'signup'
  | 'login'
  | 'dashboard'
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

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'completed';
  date: string;
  signers: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Contrat de service - Acme Corp',
      status: 'completed',
      date: '2026-01-28',
      signers: ['jean.dupont@acme.com', 'marie.martin@client.com']
    },
    {
      id: '2',
      name: 'Accord de confidentialité',
      status: 'signed',
      date: '2026-01-29',
      signers: ['paul.bernard@example.com']
    },
    {
      id: '3',
      name: 'Proposition commerciale Q1 2026',
      status: 'pending',
      date: '2026-01-30',
      signers: ['sophie.durand@business.com', 'alex.kouame@startup.ci']
    }
  ]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page, documentId?: number) => {
    if (documentId) {
      setSelectedDocumentId(documentId);
    }
    setCurrentPage(page);
  };

  const handleFileUpload = (file: { name: string; size: number }) => {
    setUploadedFile(file);
    setCurrentDocument({
      id: String(documents.length + 1),
      name: file.name,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      signers: []
    });
  };

  const handleSendDocument = (signers: string[]) => {
    if (currentDocument) {
      const newDoc = { ...currentDocument, signers };
      setDocuments([...documents, newDoc]);
      setCurrentDocument(newDoc);
    }
  };

  const handleSignDocument = (documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'completed' as const }
        : doc
    ));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'dashboard':
        return (
          <Dashboard
            documents={documents}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            onSelectDocument={setCurrentDocument}
          />
        );
      case 'upload':
        return (
          <UploadDocument
            onNavigate={navigateTo}
            onFileUpload={handleFileUpload}
          />
        );
      case 'add-signers':
        return (
          <AddSigners
            document={currentDocument}
            onNavigate={navigateTo}
            onSendDocument={handleSendDocument}
          />
        );
      case 'sending-confirmation':
        return <SendingConfirmation onNavigate={navigateTo} />;
      case 'signature':
        return (
          <SignaturePage
            document={currentDocument}
            onNavigate={navigateTo}
          />
        );
      case 'signature-confirmation':
        return <SignatureConfirmation onNavigate={navigateTo} />;
      case 'signed-document':
        return (
          <SignedDocument
            document={currentDocument}
            onSignDocument={handleSignDocument}
          />
        );
      case 'archive':
        return (
          <Archive
            documents={documents.filter(d => d.status === 'completed')}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'settings':
        return <Settings onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'documents-management':
        return (
          <DocumentsManagement
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'document-detail':
        return selectedDocumentId ? (
          <DocumentDetail
            documentId={selectedDocumentId}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        ) : (
          <LandingPage onNavigate={navigateTo} />
        );
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}
