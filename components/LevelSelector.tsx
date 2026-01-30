import React from 'react';
import { Level } from '../types';
import { LEVELS } from '../constants';
import { BarChart3 } from 'lucide-react';

interface LevelSelectorProps {
  selectedLevel: Level;
  onSelect: (level: Level) => void;
  disabled?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onSelect, disabled }) => {
  return (
    <div className="w-full mb-8">
       <label className="block text-sm font-semibold text-blue-400/80 mb-3 uppercase tracking-wider flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Select Proficiency Level
      </label>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? 'border-blue-500 bg-slate-800 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' 
                  : 'border-white/10 bg-slate-900/50 text-slate-500 hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className={`text-base font-bold ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                {level.id}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide opacity-75 mt-0.5 text-center">
                {level.label} 
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};