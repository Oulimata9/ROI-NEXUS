import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id_message: number;
  contenu: string;
  date_envoi: string;
  expediteur_role: string;
  id_expediteur: number;
  id_entreprise: number;
  lu: boolean;
}

export function useChat(entrepriseId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000';
  const wsBase = apiUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');

  useEffect(() => {
    if (!entrepriseId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch history
    fetch(`${apiUrl}/messages/${entrepriseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setMessages(data as ChatMessage[]);
      })
      .catch(() => {});

    // Mark existing messages as read
    fetch(`${apiUrl}/messages/${entrepriseId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});

    // Open WebSocket
    const ws = new WebSocket(`${wsBase}/ws/messages/${entrepriseId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as ChatMessage;
        setMessages((prev) => [...prev, msg]);
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      ws.close();
    };
  }, [entrepriseId, apiUrl, wsBase]);

  const sendMessage = useCallback((contenu: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ contenu }));
    }
  }, []);

  return { messages, connected, sendMessage };
}
