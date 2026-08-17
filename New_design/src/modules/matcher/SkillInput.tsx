import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Plus, Zap } from 'lucide-react';
import { useSkillsList } from '../../hooks/useDashboardData';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';

interface SkillInputProps {
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  onApplyPreset: (skills: string[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const PRESETS = [
  { name: 'MERN', skills: ['React', 'Node.js', 'MongoDB', 'Express'] },
  { name: 'Java Spring', skills: ['Java', 'Spring Boot', 'SQL', 'Maven'] },
  { name: '.NET', skills: ['C#', '.NET', 'SQL Server', 'Azure'] },
  { name: 'Python Data', skills: ['Python', 'Pandas', 'SQL', 'Jupyter'] },
];

export default function SkillInput({
  selectedSkills,
  onToggleSkill,
  onApplyPreset,
  onAnalyze,
  isAnalyzing,
}: SkillInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: skillsList = [] } = useSkillsList();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skillNames = skillsList.map(s => s.name);
  const filteredSkills = skillNames.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSkills.includes(s)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !selectedSkills.includes(skill.trim())) {
      onToggleSkill(skill.trim());
    }
    setInputValue('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(inputValue);
    }
  };

  return (
    <div ref={dropdownRef}>
      <GlassCard variant="elevated" className="flex flex-col space-y-4 p-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Votre Stack Technique</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ajoutez vos compétences pour évaluer la couverture du marché et le ROI des skills manquants.</p>
        </div>

        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onToggleSkill(skill)}
                  className="hover:text-indigo-900 dark:hover:text-white cursor-pointer ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 rounded-xl px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={16} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 text-sm w-full placeholder:text-slate-400"
              placeholder="Ajouter une compétence (ex: React, Docker, Python)..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(true)}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => handleAddSkill(inputValue)}
                className="text-slate-400 hover:text-indigo-500 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          {showDropdown && inputValue && filteredSkills.length > 0 && (
            <div className="absolute z-20 w-full mt-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1">
              {filteredSkills.slice(0, 10).map((skill) => (
                <button
                  type="button"
                  key={skill}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  onClick={() => handleAddSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">
            Presets Rapides
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => onApplyPreset(preset.skills)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer font-medium"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <Button
            variant="primary"
            size="md"
            onClick={onAnalyze}
            disabled={selectedSkills.length === 0 || isAnalyzing}
            className="w-full"
          >
            <Zap size={16} />
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser mon Stack'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
