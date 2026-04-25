import { useState, useRef, useEffect } from 'react';
import { X, Pen, Type, Upload, RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string, type: 'draw' | 'type' | 'upload') => void;
  signerName?: string;
  allowedModes?: Array<'draw' | 'type' | 'upload'>;
}

export default function SignatureModal({
  isOpen,
  onClose,
  onSave,
  signerName = '',
  allowedModes = ['draw', 'type', 'upload'],
}: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>(allowedModes[0] || 'draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedText, setTypedText] = useState(signerName);
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'serif' | 'script'>('cursive');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!allowedModes.includes(activeTab)) {
      setActiveTab(allowedModes[0] || 'draw');
    }
  }, [activeTab, allowedModes]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e40af';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl, 'draw');
      }
    } else if (activeTab === 'type') {
      if (typedText) {
        onSave(typedText, 'type');
      }
    } else if (activeTab === 'upload') {
      if (uploadedImage) {
        onSave(uploadedImage, 'upload');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fontStyles = {
    cursive: 'font-["Dancing_Script",cursive]',
    serif: 'font-["Playfair_Display",serif]',
    script: 'font-["Great_Vibes",cursive]'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white shadow-2xl border-2 border-gray-200 m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Créer votre signature</h2>
            <p className="text-sm text-gray-600 font-medium">Choisissez comment vous souhaitez signer</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className={`grid w-full mb-6 h-14 bg-gray-100 p-1`} style={{ gridTemplateColumns: `repeat(${allowedModes.length}, minmax(0, 1fr))` }}>
              {allowedModes.includes('draw') && (
                <TabsTrigger value="draw" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm">
                  <Pen className="w-4 h-4 mr-2" />
                  Dessiner
                </TabsTrigger>
              )}
              {allowedModes.includes('type') && (
                <TabsTrigger value="type" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm">
                  <Type className="w-4 h-4 mr-2" />
                  Taper
                </TabsTrigger>
              )}
              {allowedModes.includes('upload') && (
                <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </TabsTrigger>
              )}
            </TabsList>

            {/* Draw Tab */}
            <TabsContent value="draw" className="space-y-4">
              <div className="border-3 border-gray-300 rounded-xl overflow-hidden bg-white shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={300}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                <p className="text-sm text-gray-700 font-semibold flex items-center">
                  <Pen className="w-4 h-4 mr-2 text-blue-600" />
                  Dessinez votre signature avec votre souris ou doigt
                </p>
                <Button
                  variant="outline"
                  onClick={clearCanvas}
                  className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Effacer
                </Button>
              </div>
            </TabsContent>

            {/* Type Tab */}
            <TabsContent value="type" className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Votre nom complet</Label>
                <Input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Entrez votre nom complet"
                  className="text-lg border-2 border-gray-300 focus:border-blue-500 h-14"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Choisir un style</Label>
                <div className="grid grid-cols-3 gap-4">
                  {(['cursive', 'serif', 'script'] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      className={`p-6 border-3 rounded-xl transition-all text-center ${
                        selectedFont === font
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className={`text-2xl ${fontStyles[font]} text-gray-900`}>
                        {typedText || 'Signature'}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-2 capitalize">{font}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border-3 border-gray-300 rounded-xl p-8 bg-white min-h-[200px] flex items-center justify-center">
                <p className={`text-5xl ${fontStyles[selectedFont]} text-blue-900`}>
                  {typedText || 'Votre signature apparaîtra ici'}
                </p>
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="signature-upload"
                />
                <label
                  htmlFor="signature-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    Cliquez pour importer une image
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    PNG, JPG jusqu'à 10MB
                  </p>
                </label>
              </div>

              {uploadedImage && (
                <div className="border-3 border-gray-300 rounded-xl p-8 bg-white">
                  <p className="text-sm font-bold text-gray-700 mb-4">Aperçu</p>
                  <div className="flex items-center justify-center min-h-[200px]">
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2 border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            size="lg"
            className="border-2 border-gray-300 hover:bg-gray-100 font-bold"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            disabled={
              (activeTab === 'draw' && !canvasRef.current) ||
              (activeTab === 'type' && !typedText) ||
              (activeTab === 'upload' && !uploadedImage)
            }
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/40 font-bold px-8"
          >
            <Check className="w-5 h-5 mr-2" />
            Enregistrer la signature
          </Button>
        </div>
      </Card>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  );
}
