import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { generateScript } from '../services/aiService';

export default function ScriptGenerator({ topic, duration, videoType, script, setScript, isLoading: isParentLoading }) {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('letra');
  const [promptCopiedIndex, setPromptCopiedIndex] = useState(null);

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

          {videoType === 'musical' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap gap-4 border-b-4 border-slate-100 dark:border-slate-700 pb-4">
                <button
                  onClick={() => setActiveTab('letra')}
                  className={`px-6 py-3 rounded-2xl font-black text-lg transition-all flex items-center gap-2 ${
                    activeTab === 'letra'
                      ? 'bg-kids-secondary text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🎶 Letra de la Canción
                </button>
                <button
                  onClick={() => setActiveTab('imagenes')}
                  className={`px-6 py-3 rounded-2xl font-black text-lg transition-all flex items-center gap-2 ${
                    activeTab === 'imagenes'
                      ? 'bg-kids-primary text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  🎨 Imágenes (Prompts por Línea)
                </button>
              </div>

              {activeTab === 'letra' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {displayedScript.map((row, idx) => {
                    const isChorus = row.audio?.includes('[Coro]') || row.audio?.includes('Coro');
                    const cleanAudio = row.audio?.replace(/\[.*?\]\n?/, '').trim();
                    const sectionTag = row.audio?.match(/\[(.*?)\]/)?.[1] || (isChorus ? 'Coro' : `Verso ${idx + 1}`);

                    return (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900 border-4 border-kids-secondary/30 rounded-3xl p-6 shadow-md hover:border-kids-secondary transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 ${isChorus ? 'bg-kids-secondary' : 'bg-kids-primary'} text-white text-xs font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm`}>
                          {isChorus ? '🌟 ' : '🎵 '}{sectionTag}
                        </div>
                        <div className="pt-6">
                          <p className="text-slate-800 dark:text-slate-100 font-black text-lg leading-relaxed whitespace-pre-line font-mono tracking-wide">
                            {cleanAudio}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-kids-primary/10 border-4 border-kids-primary/30 p-4 rounded-2xl flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    <p className="text-slate-700 dark:text-slate-300 font-bold text-sm leading-relaxed">
                      Copia estos prompts en herramientas como Midjourney, DALL-E 3, Bing Image Creator o Ideogram. Todos siguen el mismo estilo maestro de Pixar/Disney para garantizar que las imágenes de tu video tengan coherencia absoluta.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {(() => {
                      let chorusSeen = false;
                      const allImagePrompts = [];

                      displayedScript.forEach((row, sIdx) => {
                        const isChorus = row.audio?.includes('[Coro]') || row.audio?.includes('Coro');
                        if (isChorus) {
                          if (!chorusSeen) {
                            if (row.imagePrompts) {
                              allImagePrompts.push(...row.imagePrompts.map(p => ({ ...p, sectionTag: 'Coro' })));
                            }
                            chorusSeen = true;
                          }
                        } else {
                          const sTag = row.audio?.match(/\[(.*?)\]/)?.[1] || `Verso ${sIdx + 1}`;
                          if (row.imagePrompts) {
                            allImagePrompts.push(...row.imagePrompts.map(p => ({ ...p, sectionTag: sTag })));
                          }
                        }
                      });

                      return allImagePrompts.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 border-4 border-kids-primary/30 rounded-3xl p-6 shadow-sm hover:border-kids-primary transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 bg-kids-primary text-white text-xs font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm">
                            {item.sectionTag} • Línea {idx + 1}
                          </div>
                          <div className="flex-1 pt-4 md:pt-0 w-full md:w-auto">
                            <p className="text-kids-secondary font-black text-xl mb-3 flex items-center gap-2">
                              <span>🎵</span> "{item.line}"
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-mono select-all leading-relaxed break-words">
                              {item.prompt}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.prompt);
                              setPromptCopiedIndex(idx);
                              setTimeout(() => setPromptCopiedIndex(null), 2000);
                            }}
                            className="btn-kids btn-primary whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-2 min-w-[180px]"
                          >
                            {promptCopiedIndex === idx ? <Check size={20} /> : <Copy size={20} />}
                            {promptCopiedIndex === idx ? '¡Copiado!' : 'Copiar Prompt'}
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border-4 border-slate-100 dark:border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">⏱️ Tiempo</th>
                    <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">👀 Visual</th>
                    <th className="p-4 font-black border-b-4 border-slate-200 dark:border-slate-700">🎵 Audio</th>
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
          )}

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
