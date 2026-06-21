import { useEffect, useState } from 'react';
import { Building2, LogOut, MessageSquare, Shield } from 'lucide-react';

import api from '../../api/axios';
import ChatPanel from '../../components/roi-nexus/ChatPanel';
import Logo from '../../components/roi-nexus/Logo';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useChat } from '../../hooks/useChat';

interface Conversation {
  id_entreprise: number;
  nom_entreprise: string;
  last_message: string;
  last_message_date: string;
  last_message_role: string;
  unread_count: number;
}

interface MessagesPageProps {
  onNavigate: (page: 'landing' | 'nexus-admin') => void;
  onLogout: () => void;
}

function ConversationItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl p-4 text-left transition ${
        active ? 'bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-slate-900">{conv.nom_entreprise}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{conv.last_message}</p>
          </div>
        </div>
        {conv.unread_count > 0 && (
          <Badge className="shrink-0 border-0 bg-blue-600 text-white">{conv.unread_count}</Badge>
        )}
      </div>
    </button>
  );
}

export default function MessagesPage({ onNavigate, onLogout }: MessagesPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const activeConv = conversations.find((c) => c.id_entreprise === activeId) ?? null;
  const { messages, connected, sendMessage } = useChat(activeId);

  const loadConversations = () => {
    api
      .get<Conversation[]>('/messages/nexus/conversations')
      .then((r) => setConversations(r.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectConv = (id: number) => {
    setActiveId(id);
    // Mark as read when opening
    api.patch(`/messages/${id}/read`).catch(() => {});
    setConversations((prev) =>
      prev.map((c) => (c.id_entreprise === id ? { ...c, unread_count: 0 } : c))
    );
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-white to-cyan-50/60">
      {/* Sidebar */}
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white/95 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-6">
          <Logo size="md" variant="dark" onClick={() => onNavigate('landing')} />
        </div>

        <div className="p-4">
          <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Admin Nexus</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Messages</h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mb-4 w-full justify-start border-slate-200 text-slate-600"
            onClick={() => onNavigate('nexus-admin')}
          >
            ← Retour dashboard
          </Button>

          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Conversations ({conversations.length})
          </p>

          <div className="space-y-1 overflow-y-auto">
            {conversations.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">Aucune conversation</p>
            )}
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id_entreprise}
                conv={conv}
                active={conv.id_entreprise === activeId}
                onClick={() => handleSelectConv(conv.id_entreprise)}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto p-4">
          <Button onClick={onLogout} variant="outline" className="w-full justify-start border-slate-300 text-red-600">
            <LogOut className="mr-2 h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex min-h-[600px] flex-1 flex-col lg:h-screen">
        {activeConv ? (
          <ChatPanel
            messages={messages}
            connected={connected}
            currentUserRole="admin_nexus"
            onSend={sendMessage}
            title={activeConv.nom_entreprise}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-400">
            <MessageSquare className="h-16 w-16 text-slate-200" />
            <p className="text-base font-semibold">Sélectionnez une conversation</p>
            <p className="text-sm">Les messages des entreprises apparaissent à gauche.</p>
          </div>
        )}
      </main>
    </div>
  );
}
