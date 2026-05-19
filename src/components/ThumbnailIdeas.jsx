import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Lightbulb, Type, Copy, Check } from 'lucide-react';
import { generateThumbnailIdeas } from '../services/aiService';

export default function ThumbnailIdeas({ topic, videoType, idea, setIdea, isLoading: isParentLoading }) {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLoading = isParentLoading || isLocalLoading;

  useEffect(() => {
    setImageLoaded(false);
  }, [idea?.visualPrompt]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    
    setIsLocalLoading(true);
    try {
      const result = await generateThumbnailIdeas(topic, videoType);
      setIdea(result);
    } catch (error) {
      console.error(error);
      alert('Error generando ideas para miniaturas.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          Ideas de Miniaturas <span className="text-4xl">🖼️</span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">Diseños que capturan la atención</p>
      </div>

      <div className="card-kids bg-white border-kids-purple/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-600 font-bold">
              {topic ? (
                <>Imaginando miniatura para: <span className="text-kids-purple">{topic}</span></>
              ) : (
                "Ingresa un tema en la configuración arriba para comenzar."
              )}
            </p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="btn-kids btn-purple min-w-[200px]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
            {isLoading ? 'Imaginando...' : 'Actualizar Imagen'}
          </button>
        </div>
      </div>

      {idea && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prompt Visual */}
          <div className="card-kids flex flex-col bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-kids-purple text-white p-3 rounded-2xl shadow-kids-button">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Prompt para IA</h3>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(idea.visualPrompt);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="p-2 text-slate-400 hover:text-kids-purple transition-colors"
                title="Copiar prompt"
              >
                {copiedPrompt ? <Check size={20} className="text-kids-green" /> : <Copy size={20} />}
              </button>
            </div>
            <div className="bg-white p-6 rounded-2xl border-4 border-kids-purple/20 flex-1 relative group">
              <div className="absolute -top-3 -right-3 text-4xl group-hover:scale-125 transition-transform">🎨</div>
              <p className="text-sm font-mono text-slate-600 leading-relaxed break-words">
                {idea.visualPrompt}
              </p>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-3">
              Copia este prompt en Midjourney, DALL-E o Leonardo.ai
            </p>
          </div>

          {/* Texto Sugerido / Miniatura Generada */}
          <div className="card-kids flex flex-col bg-gradient-to-br from-yellow-50 to-white border-kids-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-kids-accent text-slate-800 p-3 rounded-2xl shadow-kids-button">
                <Type size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Texto en Imagen</h3>
            </div>
            
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-xl border-4 border-slate-900 dark:border-slate-700 bg-slate-950 flex items-center justify-center group">
                {/* Loader / Skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white gap-3 z-10">
                    <Loader2 className="animate-spin text-kids-accent" size={32} />
                    <span className="text-sm font-bold text-slate-300">Generando miniatura con IA...</span>
                  </div>
                )}
                
                {/* Image */}
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(idea.visualPrompt)}?width=1280&height=720&nologo=true`}
                  alt="Miniatura de YouTube Generada"
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Overlay Text (Only visible when loaded) */}
                {imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                    <div className="transform -rotate-2 bg-yellow-400 border-4 border-slate-900 px-6 py-3 rounded-2xl shadow-2xl max-w-[90%] text-center">
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-wider uppercase">
                        {idea.suggestedText.toUpperCase()}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-center font-bold text-slate-500 mt-2 text-xs">
                Diseño 16:9 generado por IA. Texto sugerido: <span className="text-kids-accent font-black">"{idea.suggestedText}"</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
