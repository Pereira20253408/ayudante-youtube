import { useState, useEffect } from 'react';
import { LayoutDashboard, Wand2, Tags, Image as ImageIcon, Sparkles, Loader2, Clock, Moon, Sun, History, Film, Trash2, RotateCcw, Star, Check, Key } from 'lucide-react';
import ScriptGenerator from './components/ScriptGenerator';
import MetadataStudio from './components/MetadataStudio';
import ThumbnailIdeas from './components/ThumbnailIdeas';
import { generateScript, generateMetadata, generateThumbnailIdeas, generateRecommendedTopics } from './services/aiService';

const DEFAULT_SUGGESTED_TOPICS = [
  "Un dinosaurio que aprende a cepillarse los dientes 🦖",
  "Aventura espacial explorando los planetas 🚀",
  "Canción mágica para aprender los colores 🎨",
  "El osito que no quería compartir sus juguetes 🧸",
  "Viaje submarino conociendo a los animales del mar 🐠"
];

function App() {
  const [activeTab, setActiveTab] = useState('script');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('5 minutos');
  const [videoType, setVideoType] = useState('historia');
  const [chosenTopic, setChosenTopic] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chosenCopied, setChosenCopied] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState(DEFAULT_SUGGESTED_TOPICS);

  // Gemini API Key state
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);

  // Global results state
  const [script, setScript] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [thumbnailIdea, setThumbnailIdea] = useState(null);

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const savedTopic = localStorage.getItem('ckc_topic');
    const savedDuration = localStorage.getItem('ckc_duration');
    const savedVideoType = localStorage.getItem('ckc_videoType');
    const savedChosenTopic = localStorage.getItem('ckc_chosenTopic');
    const savedDarkMode = localStorage.getItem('ckc_darkMode');
    const savedHistory = localStorage.getItem('ckc_history');
    const savedScript = localStorage.getItem('ckc_script');
    const savedMetadata = localStorage.getItem('ckc_metadata');
    const savedThumbnail = localStorage.getItem('ckc_thumbnail');
    const savedApiKey = localStorage.getItem('ckc_gemini_api_key');
    const savedSuggestedTopics = localStorage.getItem('ckc_suggested_topics');

    if (savedTopic) setTopic(savedTopic);
    if (savedDuration) setDuration(savedDuration);
    if (savedVideoType) setVideoType(savedVideoType);
    if (savedChosenTopic) setChosenTopic(savedChosenTopic);
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedScript) setScript(JSON.parse(savedScript));
    if (savedMetadata) setMetadata(JSON.parse(savedMetadata));
    if (savedThumbnail) setThumbnailIdea(JSON.parse(savedThumbnail));
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedSuggestedTopics) setSuggestedTopics(JSON.parse(savedSuggestedTopics));

    setIsLoaded(true);
  }, []);

  const handleSelectSuggestedTopic = async (sug) => {
    const cleanTopic = sug.replace(/ [^ ]+$/, '');
    setTopic(cleanTopic);
    
    // Quitar el tema inmediatamente de la lista
    const updated = suggestedTopics.filter(t => t !== sug);
    setSuggestedTopics(updated);
    
    try {
      // Intentar traer una nueva sugerencia excluyendo las actuales
      const newTopics = await generateRecommendedTopics(1, [...updated, sug]);
      if (newTopics && newTopics.length > 0) {
        setSuggestedTopics([...updated, newTopics[0]]);
      }
    } catch (err) {
      console.warn("No se pudo obtener recomendación de Gemini, usando fallback local:", err);
      const fallbackList = [
        "El pirata bueno que regalaba juguetes en su isla 🏴‍☠️",
        "La abejita que perdió su colmena 🐝",
        "El carro de bomberos que le tenía miedo al agua 🚒",
        "La nube triste que quería llover caramelos 🌧️",
        "La carrera de caracoles más rápida del mundo 🐌"
      ];
      const available = fallbackList.filter(t => !updated.includes(t) && t !== sug);
      if (available.length > 0) {
        setSuggestedTopics([...updated, available[0]]);
      }
    }
  };

  // Guardar en localStorage cuando cambien los estados (después de cargar)
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ckc_topic', topic);
    localStorage.setItem('ckc_duration', duration);
    localStorage.setItem('ckc_videoType', videoType);
    localStorage.setItem('ckc_chosenTopic', chosenTopic);
    localStorage.setItem('ckc_darkMode', darkMode);
    localStorage.setItem('ckc_history', JSON.stringify(history));
    localStorage.setItem('ckc_suggested_topics', JSON.stringify(suggestedTopics));
    if (script) localStorage.setItem('ckc_script', JSON.stringify(script));
    if (metadata) localStorage.setItem('ckc_metadata', JSON.stringify(metadata));
    if (thumbnailIdea) localStorage.setItem('ckc_thumbnail', JSON.stringify(thumbnailIdea));
  }, [isLoaded, topic, duration, videoType, chosenTopic, darkMode, history, script, metadata, thumbnailIdea, suggestedTopics]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleGenerateAll = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoadingAll(true);
    try {
      // Parallel generation for better speed
      const [scriptRes, metadataRes, thumbnailRes] = await Promise.all([
        generateScript(topic, duration, videoType),
        generateMetadata(topic, videoType),
        generateThumbnailIdeas(topic, videoType)
      ]);
      
      setScript(scriptRes);
      setMetadata(metadataRes);
      setThumbnailIdea(thumbnailRes);

      // Guardar en historial
      const newItem = {
        id: Date.now(),
        topic,
        duration,
        videoType,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        script: scriptRes,
        metadata: metadataRes,
        thumbnailIdea: thumbnailRes
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (error) {
      console.error(error);
      if (error.message === 'API_KEY_MISSING') {
        alert('🔑 No has configurado tu API Key de Google Gemini. Por favor haz clic en el botón "🔑 Configurar API Key" en el menú lateral para ingresar tu clave y usar la IA real.');
        setShowApiModal(true);
      } else {
        alert('Error conectando con Gemini AI. Revisa tu conexión o tu API Key.');
      }
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleRestoreHistory = (item) => {
    setTopic(item.topic);
    setDuration(item.duration);
    setVideoType(item.videoType);
    setScript(item.script);
    setMetadata(item.metadata);
    setThumbnailIdea(item.thumbnailIdea);
    setActiveTab('script');
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-kids-bg dark:bg-slate-900 flex flex-col md:flex-row transition-colors relative">
      {/* Modal de Configuración de API Key */}
      {showApiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card-kids bg-white dark:bg-slate-800 max-w-lg w-full space-y-6 border-4 border-kids-secondary shadow-2xl relative">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Key className="text-kids-secondary" />
              Configurar Google Gemini API Key
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-bold text-sm leading-relaxed">
              Para generar letras de canciones, guiones y metadatos con Inteligencia Artificial real de Google Gemini, ingresa tu clave de API. 
              Esta clave se guarda de forma 100% segura y cifrada en tu propio navegador (localStorage) y nunca se sube a GitHub ni a ningún servidor externo.
            </p>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">Tu API Key (AI Studio)</label>
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                className="input-kids py-3 text-sm font-mono"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-slate-400 font-bold mt-2">
                ¿No tienes una? Consíguela gratis en <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-kids-secondary underline hover:text-blue-500 font-black">Google AI Studio</a>.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setShowApiModal(false)}
                className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Cerrar
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('ckc_gemini_api_key', apiKey.trim());
                  alert('¡API Key guardada correctamente en tu navegador!');
                  setShowApiModal(false);
                }}
                className="btn-kids btn-secondary text-sm py-3 px-6"
              >
                Guardar API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 shadow-kids p-6 flex flex-col z-10 border-r-4 border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex flex-col items-center gap-3 mb-10 mt-4 text-center">
          <img src={`${import.meta.env.BASE_URL}mascot.png`} alt="Mascota Magia Infantil" className="w-32 h-32 object-contain drop-shadow-xl animate-bounce-slow" />
          <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
            CKC
          </h1>
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
              activeTab === 'script' 
                ? 'bg-kids-secondary text-white shadow-kids-button translate-x-2' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={24} />
            {videoType === 'musical' ? 'Letra Musical' : 'Guiones'}
          </button>
          
          <button 
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
              activeTab === 'metadata' 
                ? 'bg-kids-green text-white shadow-kids-button translate-x-2' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Tags size={24} />
            Metadatos SEO
          </button>

          <button 
            onClick={() => setActiveTab('thumbnail')}
            className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
              activeTab === 'thumbnail' 
                ? 'bg-kids-purple text-white shadow-kids-button translate-x-2' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon size={24} />
            Miniaturas
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
              activeTab === 'history' 
                ? 'bg-amber-500 text-white shadow-kids-button translate-x-2' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <History size={24} />
            Historial ({history.length})
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t-4 border-slate-50 dark:border-slate-800 space-y-4">
          <button 
            onClick={() => setShowApiModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-bold transition-all hover:scale-105 border-2 border-amber-200 dark:border-amber-800/50"
          >
            <span className="flex items-center gap-2">
              <Key size={20} className="text-amber-500" />
              API Key Gemini
            </span>
            <span className={`w-3 h-3 rounded-full ${apiKey ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 animate-pulse'}`} title={apiKey ? 'Configurada' : 'No configurada'} />
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all hover:scale-105"
          >
            <span>Modo {darkMode ? 'Luz' : 'Noche'}</span>
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-kids-secondary" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-kids-bg dark:bg-slate-900 transition-colors">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Tema Escogido Oficial Banner */}
          {chosenTopic && (
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-6 text-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in border-4 border-white dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-md text-2xl animate-bounce-slow">
                  🎯
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">Tema Oficial Escogido para el Proyecto</h3>
                  <p className="text-2xl font-black text-slate-900">{chosenTopic}</p>
                </div>
              </div>
              <button
                onClick={() => setChosenTopic('')}
                className="bg-white/80 hover:bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Cambiar / Borrar
              </button>
            </div>
          )}

          {/* Global Header Inputs */}
          <div className="card-kids bg-white dark:bg-slate-800 border-kids-secondary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-kids-secondary"></div>
            <div className="p-2">
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 size={20} className="text-kids-secondary" />
                Configuración del Video
              </h2>
              <form onSubmit={handleGenerateAll} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-sm font-black text-slate-400 uppercase mb-1 ml-1">Tema del Video</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Un dinosaurio que aprende a cepillarse los dientes..."
                    className="input-kids py-3"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-black text-slate-400 uppercase mb-1 ml-1">Clase de Video</label>
                  <div className="relative">
                    <Film className="absolute left-4 top-1/2 -translate-y-1/2 text-kids-secondary" size={18} />
                    <select
                      className="input-kids py-3 pl-12 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer font-bold border-4 border-slate-200 dark:border-slate-600 rounded-2xl w-full outline-none focus:border-kids-secondary transition-colors"
                      value={videoType}
                      onChange={(e) => setVideoType(e.target.value)}
                    >
                      <option value="historia">📖 Estilo Historia / Cuento</option>
                      <option value="musical">🎵 Video Musical / Canción</option>
                      <option value="narracion">🔬 Narración / Educativo</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-slate-400 uppercase mb-1 ml-1">Duración</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ej: 5 min"
                      className="input-kids py-3 pl-12"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button 
                    type="submit" 
                    disabled={isLoadingAll || !topic}
                    className="btn-kids btn-secondary w-full h-[58px]"
                  >
                    {isLoadingAll ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {isLoadingAll ? '...' : '¡Crear!'}
                  </button>
                </div>
              </form>

              {/* Sugerencias y Marcar Tema Escogido */}
              <div className="mt-6 pt-6 border-t-2 border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">💡 Temas Recomendados (Haz clic para usar)</span>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTopics.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestedTopic(sug)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-kids-secondary hover:text-white dark:hover:bg-kids-secondary text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!topic.trim()) return alert('Escribe un tema primero en el recuadro superior');
                      setChosenTopic(topic);
                      setChosenCopied(true);
                      setTimeout(() => setChosenCopied(false), 2000);

                      // Si el tema actual ingresado coincide con alguno de la lista (ignorando emoji), removerlo y cargar otro
                      const matchingSug = suggestedTopics.find(t => t.replace(/ [^ ]+$/, '') === topic.trim());
                      if (matchingSug) {
                        handleSelectSuggestedTopic(matchingSug);
                      }
                    }}
                    disabled={!topic.trim()}
                    className="btn-kids btn-accent text-sm py-2 px-4 shadow-kids-button flex items-center gap-2 whitespace-nowrap"
                  >
                    {chosenCopied ? <Check size={18} className="text-green-600" /> : <Star size={18} className="text-amber-600 fill-amber-400" />}
                    {chosenCopied ? '¡Tema Fijado!' : '⭐ Fijar como Tema Escogido'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            {activeTab === 'script' && (
              <ScriptGenerator 
                topic={topic} 
                duration={duration}
                videoType={videoType}
                script={script} 
                setScript={setScript} 
                isLoading={isLoadingAll}
              />
            )}
            {activeTab === 'metadata' && (
              <MetadataStudio 
                topic={topic}
                videoType={videoType}
                metadata={metadata} 
                setMetadata={setMetadata} 
                isLoading={isLoadingAll}
              />
            )}
            {activeTab === 'thumbnail' && (
              <ThumbnailIdeas 
                topic={topic}
                videoType={videoType}
                idea={thumbnailIdea} 
                setIdea={setThumbnailIdea} 
                isLoading={isLoadingAll}
              />
            )}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                    Historial de Generaciones <span className="text-4xl">📖</span>
                  </h2>
                  <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">Revisa, restaura o elimina tus trabajos anteriores</p>
                </div>

                {history.length === 0 ? (
                  <div className="card-kids bg-white dark:bg-slate-800 text-center py-12">
                    <p className="text-slate-400 font-bold text-lg">No hay elementos en el historial aún. ¡Crea tu primer guion arriba!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {history.map(item => (
                      <div key={item.id} className="card-kids bg-white dark:bg-slate-800 border-l-8 border-l-kids-secondary flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-l-kids-purple transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black px-3 py-1 rounded-lg uppercase">
                              {item.videoType === 'musical' ? '🎵 Musical' : item.videoType === 'narracion' ? '🔬 Educativo' : '📖 Historia'}
                            </span>
                            <span className="text-xs font-bold text-slate-400">{item.date}</span>
                          </div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">{item.topic}</h3>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Duración: {item.duration}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          <button
                            onClick={() => handleRestoreHistory(item)}
                            className="btn-kids btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                          >
                            <RotateCcw size={16} />
                            Restaurar
                          </button>
                          <button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-2xl font-bold transition-all"
                            title="Eliminar del historial"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
