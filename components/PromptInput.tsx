import React, { useState, KeyboardEvent } from 'react';
import { Send, Wand2, Upload } from 'lucide-react';

interface PromptInputProps {
  onSend: (text: string) => void;
  onUpload: (file: File) => void;
  disabled: boolean;
  mode: 'generate' | 'edit';
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, onUpload, disabled, mode }) => {
  const [text, setText] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative flex items-center bg-zinc-800/80 backdrop-blur-md border border-zinc-700 rounded-2xl shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
        
        {/* File Upload Button - Only visible if we want to allow replacing the base image, but typically for 'edit' mode we act on existing. 
            Let's allow uploading a NEW base image at any time. */}
        <label className="flex items-center justify-center p-4 cursor-pointer text-zinc-400 hover:text-yellow-500 transition-colors border-r border-zinc-700/50">
          <Upload className="w-5 h-5" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'generate' ? "Describe an image to generate..." : "Describe how to edit this image (e.g. 'Add a retro filter')"}
          className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 px-4 py-4 text-base disabled:opacity-50"
          disabled={disabled}
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className={`p-4 transition-all duration-200 ${
            text.trim() && !disabled 
              ? 'text-yellow-500 hover:bg-yellow-500/10' 
              : 'text-zinc-600 cursor-not-allowed'
          }`}
        >
          {mode === 'generate' ? <Wand2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
      <div className="mt-2 text-center">
         <p className="text-xs text-zinc-500">
           Powered by <span className="text-yellow-600 font-semibold">Gemini 2.5 Flash Image</span> ("Nano Banana")
         </p>
      </div>
    </div>
  );
};