import React, { useState, useEffect, useRef } from 'react';
import { generateImage, editImage } from './services/geminiService';
import { PromptInput } from './components/PromptInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GeneratedImage, AppStatus } from './types';
import { Download, RefreshCw, X, Image as ImageIcon, Sparkles } from 'lucide-react';

const SUGGESTED_PROMPT = "Generate exploded engineering diagram of NVIDIA DGX SPARK";

const SUGGESTED_EDITS = [
  "Add a retro filter",
  "Remove the person in the background",
  "Make it cyberpunk style", 
  "Turn into a line drawing"
];

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // Ref to scroll to bottom if we had a chat list, but here we focus on single image canvas
  // We can use this to scroll generated image into view
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleProcess = async (prompt: string) => {
    setError(null);
    try {
      if (currentImage) {
        // Edit Mode
        setStatus(AppStatus.EDITING);
        const newImageData = await editImage(currentImage.data, prompt);
        
        const newImageObj: GeneratedImage = {
          id: crypto.randomUUID(),
          data: newImageData,
          prompt: prompt,
          timestamp: Date.now(),
        };

        setCurrentImage(newImageObj);
        setHistory(prev => [newImageObj, ...prev]);
      } else {
        // Generate Mode
        setStatus(AppStatus.GENERATING);
        const newImageData = await generateImage(prompt);
        
        const newImageObj: GeneratedImage = {
          id: crypto.randomUUID(),
          data: newImageData,
          prompt: prompt,
          timestamp: Date.now(),
        };

        setCurrentImage(newImageObj);
        setHistory(prev => [newImageObj, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setStatus(AppStatus.IDLE);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const newImageObj: GeneratedImage = {
          id: crypto.randomUUID(),
          data: e.target.result,
          prompt: "Uploaded Image",
          timestamp: Date.now(),
        };
        setCurrentImage(newImageObj);
        setHistory(prev => [newImageObj, ...prev]);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setCurrentImage(null);
    setError(null);
  };

  const handleSelectFromHistory = (img: GeneratedImage) => {
    setCurrentImage(img);
    setError(null);
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage.data;
    link.download = `gemini-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0f0f11]/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-black font-bold text-lg">
            N
          </div>
          <h1 className="text-xl font-bold tracking-tight">Nano Banana Studio</h1>
        </div>
        <div className="flex gap-4 text-sm text-zinc-400">
          <span className="hover:text-yellow-400 transition cursor-pointer">Gallery</span>
          <span className="hover:text-yellow-400 transition cursor-pointer">About</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative bg-[#131316]">
          
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex items-center justify-center" ref={imageContainerRef}>
            
            {status !== AppStatus.IDLE ? (
              <LoadingSpinner message={status === AppStatus.GENERATING ? "Dreaming up pixels..." : "Editing your masterpiece..."} />
            ) : currentImage ? (
              <div className="relative max-w-full max-h-full group">
                <img 
                  src={currentImage.data} 
                  alt="Current workspace" 
                  className="max-w-full max-h-[70vh] rounded-xl shadow-2xl border border-zinc-800 object-contain mx-auto"
                />
                
                {/* Image Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={handleDownload}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur border border-white/10"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                   <button 
                    onClick={handleClear}
                    className="p-2 bg-black/50 hover:bg-red-500/50 text-white rounded-lg backdrop-blur border border-white/10"
                    title="Close Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-zinc-400 text-sm font-medium bg-zinc-900/50 py-1 px-3 rounded-full inline-block border border-zinc-800">
                       {currentImage.prompt}
                    </p>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">What shall we create?</h2>
                <p className="text-zinc-400">
                  Start by describing an image you want to create, or upload one to start editing.
                </p>
                
                {/* Suggested Prompts */}
                <div className="flex flex-col gap-2 pt-4">
                  <button 
                    onClick={() => handleProcess(SUGGESTED_PROMPT)}
                    className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-xl transition-all text-left border border-zinc-700/50 hover:border-yellow-500/30 group"
                  >
                    <span className="block text-xs text-yellow-500 mb-1 group-hover:text-yellow-400">Try this:</span>
                    "{SUGGESTED_PROMPT}"
                  </button>
                  <button 
                    onClick={() => handleProcess("Cutaway view of a jet engine with technical labels")}
                    className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-xl transition-all text-left border border-zinc-700/50 hover:border-yellow-500/30"
                  >
                     "Cutaway view of a jet engine with technical labels"
                  </button>
                </div>
              </div>
            )}

            {error && (
               <div className="absolute bottom-24 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl max-w-lg mx-auto text-center backdrop-blur-md">
                 <p className="text-sm font-medium">{error}</p>
                 <button onClick={() => setError(null)} className="text-xs underline mt-1 hover:text-white">Dismiss</button>
               </div>
            )}
          </div>

          {/* Bottom Input Area */}
          <div className="p-4 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11] to-transparent flex flex-col gap-3">
             
             {/* Suggestions for Editing */}
             {currentImage && (
               <div className="flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-hide justify-center items-center">
                 {SUGGESTED_EDITS.map((edit) => (
                   <button
                     key={edit}
                     onClick={() => handleProcess(edit)}
                     disabled={status !== AppStatus.IDLE}
                     className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-yellow-500/50 text-xs text-zinc-300 hover:text-white transition-all backdrop-blur-sm"
                   >
                     {edit}
                   </button>
                 ))}
               </div>
             )}

             <PromptInput 
               onSend={handleProcess} 
               onUpload={handleUpload} 
               disabled={status !== AppStatus.IDLE}
               mode={currentImage ? 'edit' : 'generate'}
             />
          </div>
        </div>

        {/* Right Sidebar - History */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-[#0f0f11] p-4 flex flex-col hidden lg:flex">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-zinc-300 text-sm uppercase tracking-wider">History</h3>
             <span className="text-xs text-zinc-500">{history.length} items</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10 text-zinc-600">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectFromHistory(item)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    currentImage?.id === item.id 
                      ? 'border-yellow-500 ring-1 ring-yellow-500/50' 
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <img src={item.data} alt="History thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-xs text-white line-clamp-2">{item.prompt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;