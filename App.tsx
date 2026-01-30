import React, { useState } from 'react';
import { TopicSelector } from './components/TopicSelector';
import { LevelSelector } from './components/LevelSelector';
import { QuestionCard } from './components/QuestionCard';
import { Button } from './components/Button';
import { Topic, Level, InterviewQuestion } from './types';
import { generateQuestion } from './services/geminiService';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<Topic>(Topic.RANDOM);
  const [level, setLevel] = useState<Level>(Level.B2);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const question = await generateQuestion(topic, level);
      setCurrentQuestion(question);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 429 || err?.message?.includes('429') || err?.message?.toLowerCase().includes('quota')) {
        setError("Daily AI quota exceeded. Please check your plan or try again later.");
      } else {
        setError("Something went wrong. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black text-blue-50 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white leading-none">
                  QUESTION<span className="text-blue-500">AI</span>
                </span>
                <span className="text-[10px] font-semibold text-blue-400/60 uppercase tracking-widest">
                  Created by Ricka
                </span>
              </div>
            </div>
            <div className="text-xs font-bold text-blue-400 bg-blue-950/30 border border-blue-500/20 px-3 py-1 rounded-full hidden sm:block">
              {level} Practice Mode
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-600 mb-4 drop-shadow-sm">
            Master Your English Interview
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Practice with premium AI-generated questions tailored for <span className="font-semibold text-blue-400">{level}</span> level learners. 
            Refine your grammar and vocabulary with <span className="text-blue-400">QuestionAI</span>.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-10 bg-slate-900/30 p-6 rounded-2xl shadow-2xl border border-white/5 backdrop-blur-sm">
          <LevelSelector 
            selectedLevel={level}
            onSelect={setLevel}
            disabled={loading}
          />

          <TopicSelector 
            selectedTopic={topic} 
            onSelect={setTopic} 
            disabled={loading}
          />
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleGenerate} 
              isLoading={loading}
              className="w-full sm:w-auto min-w-[240px] text-lg py-4 font-bold tracking-wide"
            >
              {currentQuestion ? 'Next Question' : 'Start Interview'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border-l-4 border-red-500 text-red-200 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="transition-opacity duration-300">
          <QuestionCard data={currentQuestion} isLoading={loading} level={level} />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="text-center text-slate-600 text-sm py-6">
        <p>© {new Date().getFullYear()} QUESTIONAI. Powered by Gemini.</p>
      </footer>
    </div>
  );
}