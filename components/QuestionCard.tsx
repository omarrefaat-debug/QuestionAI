import React, { useState, useEffect } from 'react';
import { InterviewQuestion, Level } from '../types';
import { Lightbulb, MessageCircle, BookOpen, Volume2 } from 'lucide-react';

interface QuestionCardProps {
  data: InterviewQuestion | null;
  isLoading: boolean;
  level: Level;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ data, isLoading, level }) => {
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Reset hint state when data changes
    setShowHint(false);
  }, [data]);

  const speakQuestion = () => {
    if (!data?.questionText) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(data.questionText);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-8 min-h-[400px] flex flex-col justify-center animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/4 mb-6 mx-auto"></div>
        <div className="h-8 bg-slate-800 rounded w-3/4 mb-4 mx-auto"></div>
        <div className="h-8 bg-slate-800 rounded w-2/3 mb-12 mx-auto"></div>
        <div className="h-32 bg-slate-800 rounded-xl w-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="bg-slate-800 p-4 rounded-full mb-6 border border-blue-500/20">
          <MessageCircle className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Ready to Practice?</h3>
        <p className="text-slate-400 max-w-sm">
          Select your level and topic above, then click "Generate Question" to start your interview simulation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-blue-500/20 overflow-hidden transition-all duration-500 ease-in-out">
      {/* Header Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 flex justify-between items-center shadow-lg">
        <span className="text-xs font-bold tracking-widest text-white uppercase opacity-90">
          {data.category}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-black/20 text-white backdrop-blur-sm border border-black/10">
          {level} Level
        </span>
      </div>

      <div className="p-8 sm:p-10">
        {/* The Question */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
            "{data.questionText}"
          </h2>
          <button 
            onClick={speakQuestion}
            className="inline-flex items-center gap-2 text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            {isSpeaking ? 'Stop Reading' : 'Listen'}
          </button>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-slate-800 mx-auto rounded-full mb-8"></div>

        {/* Hints Section */}
        <div className="relative">
          {!showHint ? (
             <div className="text-center">
                <button
                  onClick={() => setShowHint(true)}
                  className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors border border-white/5">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">Reveal Interview Tips</span>
                </button>
             </div>
          ) : (
            <div className="bg-black/40 rounded-xl p-6 border border-blue-500/10 animate-fadeIn">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold text-sm uppercase tracking-wide">
                    <BookOpen className="w-4 h-4" />
                    Grammar Focus
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-white/5 shadow-sm">
                    {data.grammarFocus}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-sm uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4" />
                    Pro Tip
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-white/5 shadow-sm">
                    {data.tip}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Sample Starter</p>
                <p className="text-blue-100 font-medium italic bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                  "{data.sampleStarter}..."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};