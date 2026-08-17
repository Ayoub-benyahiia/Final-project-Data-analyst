import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { useGlobalFilters } from '../hooks/useGlobalFilters';
import { useSkillsList } from '../hooks/useDashboardData';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

function MultiSelectDropdown({ label, options, selectedValues, onChange }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const isSelected = selectedValues.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
          isSelected 
            ? "border-indigo-500/80 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-850/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        )}
      >
        <span>{label}</span>
        {isSelected && (
          <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown size={12} className={cn("transition-transform text-slate-400", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-60 max-h-64 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-xs text-slate-500">Aucune option</div>
          ) : (
            options.map(option => {
              const checked = selectedValues.includes(option);
              return (
                <div
                  key={option}
                  className="flex items-center px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  onClick={() => toggleOption(option)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-3.5 h-3.5 mr-2.5 border rounded transition-colors",
                    checked 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "border-slate-300 dark:border-slate-600 bg-transparent"
                  )}>
                    {checked && <Check size={10} />}
                  </div>
                  <span className="truncate">{option}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function GlobalFilterBar() {
  const { filters, setFilter, clearFilters, isActive, activeCount } = useGlobalFilters();
  const { data: skillsList = [] } = useSkillsList();
  
  const contracts = ['CDI', 'CDD', 'Stage', 'Freelance', 'Intérim'];
  const education = ['Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'];
  const experience = ['Junior', 'Confirmé', 'Senior', 'Expert'];
  const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Oujda', 'Témara', 'Salé', 'Kénitra'];
  const techOptions = skillsList.map(s => s.name);

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mr-1">
          <Filter size={14} className="text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">Filtres:</span>
        </div>
        
        <MultiSelectDropdown 
          label="Villes" 
          options={cities} 
          selectedValues={filters.cities} 
          onChange={(v) => setFilter('cities', v)} 
        />
        <MultiSelectDropdown 
          label="Contrats" 
          options={contracts} 
          selectedValues={filters.contracts} 
          onChange={(v) => setFilter('contracts', v)} 
        />
        <MultiSelectDropdown 
          label="Éducation" 
          options={education} 
          selectedValues={filters.education} 
          onChange={(v) => setFilter('education', v)} 
        />
        <MultiSelectDropdown 
          label="Expérience" 
          options={experience} 
          selectedValues={filters.experience} 
          onChange={(v) => setFilter('experience', v)} 
        />
        <MultiSelectDropdown 
          label="Technologies" 
          options={techOptions} 
          selectedValues={filters.technologies} 
          onChange={(v) => setFilter('technologies', v)} 
        />

        {isActive && (
          <Badge variant="indigo" className="ml-1">
            {activeCount} actif{activeCount > 1 ? 's' : ''}
          </Badge>
        )}
        
        {isActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors ml-auto cursor-pointer"
          >
            <X size={12} />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GlobalFilterBar;
