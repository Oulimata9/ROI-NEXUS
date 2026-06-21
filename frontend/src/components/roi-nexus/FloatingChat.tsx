import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

import { useChat } from '../../hooks/useChat';
import ChatPanel from './ChatPanel';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  const rawId = localStorage.getItem('id_entreprise');
  const entrepriseId = rawId ? Number(rawId) : null;
  const currentRole = localStorage.getItem('user_role') || 'administrateur';

  const { messages, connected, sendMessage } = useChat(open ? entrepriseId : null);

  const unreadCount = messages.filter(
    (m) => !m.lu && m.expediteur_role !== currentRole
  ).length;

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/30">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 px-5 py-4">
            <div>
              <p className="font-bold text-white">Support Nexus</p>
              <p className="text-xs text-blue-200">
                {connected ? 'En ligne' : 'Connexion...'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              connected={connected}
              currentUserRole={currentRole}
              onSend={sendMessage}
            />
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <MessageSquare className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
