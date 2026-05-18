import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { generateScript } from '../services/aiService';

export default function ScriptGenerator({ topic, duration, videoType, script, setScript, isLoading: isParentLoading }) {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const isLoading = isParentLoading || isLocalLoading;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setIsLocalLoading(true);
    setShowAll(false);
    try {
      const result = await generateScript(topic, duration, videoType);
      setScript(result);
    } catch (error) {
      console.error(error);
      if (error.message === 'API_KEY_MISSING') {
        alert('🔑 No has configurado tu API Key de Google Gemini. Por favor haz clic en el botón "🔑 Configurar API Key" en el menú lateral para ingresar tu clave y usar la IA real.');
      } else {
        alert('Error generando el contenido.');
      }
    } finally {
      setIsLocalLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!script) return;
    const text = script.map(row => row.audio).join('\n\n');
    navigator.clipboard.writeText(`${videoType === 'musical' ? 'Letra de Canción' : 'Guion'}: ${topic}\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedScript = showAll ? script : script?.slice(0, 10);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          {videoType === 'musical' ? (
            <>Generador de Letras de Canciones <span className="text-4xl">🎤</span></>
          ) : videoType === 'narracion' ? (
            <>Generador de Guiones Educativos <span className="text-4xl">🔬</span></>
          ) : (
            <>Generador de Guiones <span className="text-4xl">🎬</span></>
          )}
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">
          {videoType === 'musical' ? 'Crea letras pegadizas y ritmos virales en segundos' : 'Crea historias mágicas en segundos'}
        </p>
      </div>

      <div className="card-kids bg-white dark:bg-slate-800 border-kids-secondary/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-600 dark:text-slate-300 font-bold">
              {topic ? (
                <>Generando {videoType === 'musical' ? 'letra' : 'guion'} para: <span className="text-kids-secondary">{topic}</span> ({duration})</>
              ) : (
                "Ingresa un tema en la configuración arriba para comenzar."
              )}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="btn-kids btn-secondary min-w-[200px]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isLoading ? 'Creando...' : videoType === 'musical' ? 'Actualizar Letra' : 'Actualizar Guion'}
          </button>
        </div>
      </div>

      {script && (
        <div className="card-kids">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                {videoType === 'musical' ? 'Tu Letra Musical 🎶' : 'Tu Guion Mágico ✨'}
              </h3>
              <span className="text-sm font-bold text-kids-secondary bg-kids-secondary/10 px-3 py-1 rounded-full w-fit mt-1">
                {script.length} secciones {!showAll && script.length > 10 ? '(Mostrando 10)' : ''}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-kids-secondary font-bold hover:text-blue-600 transition-colors bg-blue-50 dark:bg-slate-700 px-4 py-2 rounded-xl"
            >
              {copied ? <Check size={20} className="text-kids-green" /> : <Copy size={20} />}
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border-4 border-slate-100 dark:border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">
                    {videoType === 'musical' ? '🎼 Sección / Tiempo' : '⏱️ Tiempo'}
                  </th>
                  <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">👀 Visual</th>
                  <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">
                    {videoType === 'musical' ? '🎤 Letra / Coro' : '🎵 Audio'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedScript.map((row, idx) => (
                  <tr key={idx} className="border-b-4 border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.time}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-200">{row.visual}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium italic whitespace-pre-line">"{row.audio}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showAll && script.length > 10 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAll(true)}
                className="text-kids-secondary font-black hover:underline flex items-center gap-2 text-lg"
              >
                Ver las {script.length - 10} secciones restantes ↓
              </button>
            </div>
          )}

          {showAll && script.length > 10 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAll(false)}
                className="text-slate-400 font-bold hover:underline text-sm"
              >
                Ver menos ↑
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
