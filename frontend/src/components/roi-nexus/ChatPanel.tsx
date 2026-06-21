import { useEffect, useRef, useState } from 'react';

import { type ChatMessage } from '../../hooks/useChat';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ChatPanelProps {
  messages: ChatMessage[];
  connected: boolean;
  currentUserRole: string;
  onSend: (text: string) => void;
  title?: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

export default function ChatPanel({ messages, connected, currentUserRole, onSend, title }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !connected) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const grouped: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const d = formatDate(msg.date_envoi);
    const last = grouped[grouped.length - 1];
    if (last && last.date === d) {
      last.msgs.push(msg);
    } else {
      grouped.push({ date: d, msgs: [msg] });
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <p className="font-bold text-slate-900">{title}</p>
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${connected ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {connected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Aucun message pour le moment. Démarrez la conversation.
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.date}>
            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">{group.date}</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-2">
              {group.msgs.map((msg) => {
                const isMine = msg.expediteur_role === currentUserRole;
                return (
                  <div key={msg.id_message} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isMine
                        ? 'rounded-br-sm bg-blue-600 text-white'
                        : 'rounded-bl-sm bg-white text-slate-900 border border-slate-200'
                    }`}>
                      {!isMine && (
                        <p className={`mb-1 text-xs font-bold ${isMine ? 'text-blue-200' : 'text-blue-600'}`}>
                          {msg.expediteur_role === 'admin_nexus' ? 'Support Nexus' : 'Votre entreprise'}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
                      <p className={`mt-1 text-right text-[11px] ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                        {formatTime(msg.date_envoi)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? 'Écrire un message...' : 'Connexion en cours...'}
            disabled={!connected}
            className="rounded-xl border-slate-200 text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!connected || !input.trim()}
            className="rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 shrink-0"
          >
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
