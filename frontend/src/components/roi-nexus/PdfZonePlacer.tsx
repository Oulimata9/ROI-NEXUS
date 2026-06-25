import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../ui/button';

export interface Zone {
  id_zone?: number;
  email_signataire: string;
  page: number;
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
  verrouille?: boolean;
}

interface DragState {
  idx: number;
  startMouseX: number;
  startMouseY: number;
  startZoneX: number;
  startZoneY: number;
}

interface PdfZonePlacerProps {
  /** ID du document (mode créateur authentifié) */
  documentId?: number;
  /** Token du signataire (mode signataire public) */
  signerToken?: string;
  /** Liste des emails des signataires (mode créateur) */
  signers?: string[];
  /** Mode lecture seule — signataire ne peut que voir sa zone */
  readonly?: boolean;
  /** Email à mettre en surbrillance (mode signataire) */
  highlightEmail?: string;
}

const COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#d97706', '#059669', '#db2777'];

function signerColor(email: string, signers: string[]): string {
  const idx = signers.indexOf(email);
  return COLORS[Math.max(0, idx) % COLORS.length];
}

export default function PdfZonePlacer({
  documentId,
  signerToken,
  signers = [],
  readonly = false,
  highlightEmail,
}: PdfZonePlacerProps) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [pendingSigner, setPendingSigner] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const isDraggingRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Charge le PDF et les zones
  useEffect(() => {
    let objectUrl: string | null = null;

    const load = async () => {
      setIsLoadingPdf(true);
      try {
        let pdfResponse;
        if (documentId) {
          pdfResponse = await api.get(`/documents/${documentId}/preview`, { responseType: 'blob' });
        } else if (signerToken) {
          pdfResponse = await api.get(`/signatures/pdf/${signerToken}`, { responseType: 'blob' });
        } else {
          return;
        }

        const count = Number(pdfResponse.headers['x-page-count']) || 1;
        setPageCount(count);
        objectUrl = URL.createObjectURL(pdfResponse.data);
        setPdfBlobUrl(objectUrl);

        // Charge les zones
        if (documentId) {
          const zonesRes = await api.get(`/documents/${documentId}/zones`);
          setZones(zonesRes.data);
        } else if (signerToken) {
          const zonesRes = await api.get(`/signatures/public/${signerToken}/zones`);
          setZones(zonesRes.data);
        }
      } catch {
        // Erreur silencieuse - l'utilisateur verra juste un PDF vide
      } finally {
        setIsLoadingPdf(false);
      }
    };

    void load();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [documentId, signerToken]);

  // Clic sur l'overlay pour placer une nouvelle zone
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!pendingSigner || isDraggingRef.current || !overlayRef.current || !documentId) return;
      e.stopPropagation();

      const rect = overlayRef.current.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      const newZone: Zone = {
        email_signataire: pendingSigner,
        page: currentPage,
        x: Math.max(0, Math.min(78, xPct)),
        y: Math.max(0, Math.min(90, yPct)),
        largeur: 22,
        hauteur: 8,
      };

      api
        .post(`/documents/${documentId}/zones`, newZone)
        .then((res) => {
          setZones((prev) => [...prev, { ...newZone, id_zone: res.data.id_zone, verrouille: false }]);
        })
        .catch(() => {});

      setPendingSigner(null);
    },
    [pendingSigner, currentPage, documentId],
  );

  // Début du drag sur une zone
  const handleZoneMouseDown = useCallback(
    (e: React.MouseEvent, idx: number) => {
      if (readonly) return;
      e.stopPropagation();
      e.preventDefault();
      isDraggingRef.current = true;
      setDragState({
        idx,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startZoneX: zones[idx].x,
        startZoneY: zones[idx].y,
      });
    },
    [readonly, zones],
  );

  // Mouvement pendant le drag
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragState || !overlayRef.current) return;
      const rect = overlayRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragState.startMouseX) / rect.width) * 100;
      const dy = ((e.clientY - dragState.startMouseY) / rect.height) * 100;
      const zone = zones[dragState.idx];

      setZones((prev) =>
        prev.map((z, i) =>
          i === dragState.idx
            ? {
                ...z,
                x: Math.max(0, Math.min(100 - z.largeur, dragState.startZoneX + dx)),
                y: Math.max(0, Math.min(100 - z.hauteur, dragState.startZoneY + dy)),
              }
            : z,
        ),
      );
      void zone;
    },
    [dragState, zones],
  );

  // Fin du drag : sauvegarde la nouvelle position
  const handleMouseUp = useCallback(async () => {
    if (!dragState) return;
    isDraggingRef.current = false;
    const zone = zones[dragState.idx];

    if (zone.id_zone && !zone.verrouille) {
      try {
        await api.put(`/zones/${zone.id_zone}`, {
          x: zone.x,
          y: zone.y,
          largeur: zone.largeur,
          hauteur: zone.hauteur,
        });
      } catch {
        // ignore
      }
    }
    setDragState(null);
  }, [dragState, zones]);

  // Suppression d'une zone
  const handleDeleteZone = async (zone: Zone, idx: number) => {
    if (zone.id_zone) {
      try {
        await api.delete(`/zones/${zone.id_zone}`);
      } catch {
        return;
      }
    }
    setZones((prev) => prev.filter((_, i) => i !== idx));
  };

  const pageZones = zones.filter((z) => z.page === currentPage);
  const allSigners = signers.length > 0 ? signers : [...new Set(zones.map((z) => z.email_signataire))];

  const embedSrc = pdfBlobUrl
    ? `${pdfBlobUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`
    : undefined;

  return (
    <div className="flex gap-4">
      {/* Panneau gauche — contrôles (mode créateur uniquement) */}
      {!readonly && (
        <div className="w-52 shrink-0 space-y-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Signataires
            </p>
            <div className="space-y-2">
              {allSigners.map((email) => {
                const color = signerColor(email, allSigners);
                const isActive = pendingSigner === email;
                return (
                  <div key={email} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-xs text-gray-700">{email}</span>
                    <button
                      onClick={() => setPendingSigner(isActive ? null : email)}
                      className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold text-white transition-colors ${
                        isActive
                          ? 'bg-blue-800 ring-2 ring-blue-400'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isActive ? '✕' : '＋'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {pageZones.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Zones — page {currentPage}
              </p>
              <div className="space-y-1">
                {pageZones.map((zone) => {
                  const idx = zones.indexOf(zone);
                  const color = signerColor(zone.email_signataire, allSigners);
                  return (
                    <div
                      key={zone.id_zone ?? `z-${idx}`}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
                        {zone.email_signataire.split('@')[0]}
                      </span>
                      {!zone.verrouille && (
                        <button
                          onClick={() => handleDeleteZone(zone, idx)}
                          className="shrink-0 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                      {zone.verrouille && (
                        <span className="text-xs text-gray-400">🔒</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pendingSigner && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              Cliquez sur le PDF pour placer la zone de{' '}
              <span className="font-bold">{pendingSigner.split('@')[0]}</span>
            </div>
          )}
        </div>
      )}

      {/* Zone droite — visionneuse PDF + overlay */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Navigation pages */}
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Conteneur PDF + overlay */}
        <div
          className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100"
          style={{ height: 580 }}
        >
          {isLoadingPdf ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Chargement du document...
            </div>
          ) : embedSrc ? (
            <embed
              key={embedSrc}
              src={embedSrc}
              type="application/pdf"
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Document indisponible
            </div>
          )}

          {/* Overlay transparent pour la capture des clics de placement */}
          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{
              pointerEvents: pendingSigner || dragState ? 'all' : 'none',
              cursor: pendingSigner ? 'crosshair' : 'default',
            }}
            onClick={handleOverlayClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {pageZones.map((zone, localIdx) => {
              const idx = zones.indexOf(zone);
              const color = signerColor(zone.email_signataire, allSigners);
              const isHighlighted =
                !highlightEmail || zone.email_signataire === highlightEmail;

              return (
                <div
                  key={zone.id_zone ?? `overlay-${localIdx}`}
                  style={{
                    position: 'absolute',
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.largeur}%`,
                    height: `${zone.hauteur}%`,
                    border: `2px ${zone.verrouille ? 'solid' : 'dashed'} ${color}`,
                    backgroundColor: `${color}${isHighlighted ? '25' : '10'}`,
                    opacity: isHighlighted ? 1 : 0.6,
                    cursor: readonly || zone.verrouille ? 'default' : 'move',
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    borderRadius: 4,
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleZoneMouseDown(e, idx)}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color,
                      textAlign: 'center',
                      padding: '2px 4px',
                      wordBreak: 'break-all',
                      lineHeight: 1.2,
                    }}
                  >
                    ✍ {zone.email_signataire.split('@')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {!readonly && (
          <p className="text-xs text-gray-400">
            Glissez les zones pour les repositionner. Les zones sont verrouillées à l'envoi.
          </p>
        )}
      </div>
    </div>
  );
}
