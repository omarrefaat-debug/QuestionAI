import React from 'react';
import { Topic } from '../types';
import { TOPICS } from '../constants';
import { Briefcase, Cpu, GraduationCap, Sprout, BrainCircuit, Shuffle, Lightbulb } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: Topic;
  onSelect: (topic: Topic) => void;
  disabled?: boolean;
}

const icons: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  cpu: Cpu,
  graduation: GraduationCap,
  sprout: Sprout,
  brain: BrainCircuit,
  shuffle: Shuffle,
  bulb: Lightbulb,
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopic, onSelect, disabled }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-blue-400/80 mb-3 uppercase tracking-wider">
        Select Interview Focus
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
        {TOPICS.map((topic) => {
          const Icon = icons[topic.icon];
          const isSelected = selectedTopic === topic.id;
          
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group min-h-[90px]
                ${isSelected 
                  ? 'border-blue-500 bg-slate-800 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-blue-500/50 hover:bg-slate-800'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className={`w-5 h-5 mb-2 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400/70'}`} />
              <span className="text-[10px] font-medium text-center leading-tight">
                {topic.label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};