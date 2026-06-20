
import { Component, type ReactNode } from "react"; 
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#1e293b' }}>
          <h2 style={{ color: '#dc2626' }}>Une erreur inattendue s'est produite</h2>
          <pre style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, fontSize: 13 }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ marginTop: 16, padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Réinitialiser et retourner à l'accueil
          </button>
        </div>
      );
      
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
