import { useState, useEffect } from 'react';
import { LayoutDashboard, Wand2, Tags, Image as ImageIcon, Sparkles, Loader2, Clock, Moon, Sun } from 'lucide-react';
import ScriptGenerator from './components/ScriptGenerator';
import MetadataStudio from './components/MetadataStudio';
import ThumbnailIdeas from './components/ThumbnailIdeas';
import { generateScript, generateMetadata, generateThumbnailIdeas } from './services/aiService';

function App() {
  const [activeTab, setActiveTab] = useState('script');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('5 minutos');
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Global results state
  const [script, setScript] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [thumbnailIdea, setThumbnailIdea] = useState(null);

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
        generateScript(topic, duration),
        generateMetadata(topic),
        generateThumbnailIdeas(topic)
      ]);
      
      setScript(scriptRes);
      setMetadata(metadataRes);
      setThumbnailIdea(thumbnailRes);
    } catch (error) {
      console.error(error);
      alert('Error generando contenido global.');
    } finally {
      setIsLoadingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-kids-bg dark:bg-slate-900 flex flex-col md:flex-row transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 shadow-kids p-6 flex flex-col z-10 border-r-4 border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex flex-col items-center gap-3 mb-10 mt-4 text-center">
          <img src="/mascot.png" alt="Mascota Magia Infantil" className="w-32 h-32 object-contain drop-shadow-xl animate-bounce-slow" />
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
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={24} />
            Guiones
          </button>
          
          <button 
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
              activeTab === 'metadata' 
                ? 'bg-kids-green text-white shadow-kids-button translate-x-2' 
                : 'text-slate-500 hover:bg-slate-100'
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
        </nav>

        <div className="mt-auto pt-6 border-t-4 border-slate-50 dark:border-slate-800">
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
          {/* Global Header Inputs */}
          <div className="card-kids bg-white dark:bg-slate-800 border-kids-secondary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-kids-secondary"></div>
            <div className="p-2">
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Wand2 size={20} className="text-kids-secondary" />
                Configuración del Video
              </h2>
              <form onSubmit={handleGenerateAll} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
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
                    {isLoadingAll ? '...' : '¡Todo!'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="pt-4">
            {activeTab === 'script' && (
              <ScriptGenerator 
                topic={topic} 
                duration={duration} 
                script={script} 
                setScript={setScript} 
                isLoading={isLoadingAll}
              />
            )}
            {activeTab === 'metadata' && (
              <MetadataStudio 
                topic={topic} 
                metadata={metadata} 
                setMetadata={setMetadata} 
                isLoading={isLoadingAll}
              />
            )}
            {activeTab === 'thumbnail' && (
              <ThumbnailIdeas 
                topic={topic} 
                idea={thumbnailIdea} 
                setIdea={setThumbnailIdea} 
                isLoading={isLoadingAll}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
