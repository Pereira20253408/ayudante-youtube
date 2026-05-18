import { useState } from 'react';
import { Tags, Copy, Check, Loader2 } from 'lucide-react';
import { generateMetadata } from '../services/aiService';

export default function MetadataStudio({ topic, metadata, setMetadata, isLoading: isParentLoading }) {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(null);

  const isLoading = isParentLoading || isLocalLoading;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    
    setIsLocalLoading(true);
    try {
      const result = await generateMetadata(topic);
      setMetadata(result);
    } catch (error) {
      console.error(error);
      alert('Error generando metadatos.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(type);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          Estudio de Metadatos <span className="text-4xl">🚀</span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">Optimiza tu video para ser viral</p>
      </div>

      <div className="card-kids bg-white dark:bg-slate-800 border-kids-green/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-600 dark:text-slate-300 font-bold">
              {topic ? (
                <>Optimizando SEO para: <span className="text-kids-green">{topic}</span></>
              ) : (
                "Ingresa un tema en la configuración arriba para comenzar."
              )}
            </p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="btn-kids btn-green min-w-[200px]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Tags />}
            {isLoading ? 'Generando...' : 'Actualizar SEO'}
          </button>
        </div>
      </div>

      {metadata && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Títulos */}
          <div className="card-kids flex flex-col bg-white dark:bg-slate-800">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Títulos Virales 🎯</h3>
            <div className="space-y-3 flex-1">
              {metadata.titles.map((title, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-kids-green transition-colors">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{title}</span>
                  <button 
                    onClick={() => copyText(title, `title-${idx}`)}
                    className="p-2 text-slate-400 hover:text-kids-green transition-colors"
                  >
                    {copiedTitle === `title-${idx}` ? <Check size={20} className="text-kids-green" /> : <Copy size={20} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            {/* Descripción */}
            <div className="card-kids flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Descripción SEO 📝</h3>
                <button 
                  onClick={() => copyText(metadata.description, 'desc')}
                  className="text-slate-400 hover:text-kids-green transition-colors"
                >
                  {copiedTitle === 'desc' ? <Check size={20} className="text-kids-green" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 whitespace-pre-line">
                {metadata.description}
              </p>
            </div>

            {/* Hashtags */}
            <div className="card-kids">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Hashtags #️⃣</h3>
                <button 
                  onClick={() => copyText(metadata.hashtags.join(' '), 'tags')}
                  className="text-slate-400 hover:text-kids-green transition-colors"
                >
                  {copiedTitle === 'tags' ? <Check size={20} className="text-kids-green" /> : <Copy size={20} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-kids-secondary/10 dark:bg-kids-secondary/20 text-kids-secondary font-bold px-3 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
