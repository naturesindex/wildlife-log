import { Search, X, Star } from 'lucide-react';
import { BioCategory, Language } from '../types';
import { BIO_CATEGORIES } from '../data/constants';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export function SearchBar({ value, onChange, language }: SearchBarProps) {
  return (
    <div className="relative mx-4 mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
     <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={language === 'EN' ? "Search species..." : "Buscar especies..."}
        className="w-full bg-white rounded-2xl border-2 border-stone-200 pl-10 pr-10 py-3 text-stone-800 placeholder:text-stone-400 text-sm font-medium outline-none focus:border-stone-400 transition-colors shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-stone-400" />
        </button>
      )}
    </div>
  );
}

type ActiveFilter = BioCategory | 'Favorites' | null;

iinterface CategoryTabsProps {
  activeFilter: ActiveFilter;
  onChange: (filter: ActiveFilter) => void;
  language: Language;
}

const CATEGORY_ES: Record<string, string> = {
  'Mammals': 'Mamíferos',
  'Birds': 'Aves',
  'Reptiles & Amphibians': 'Reptiles y Anfibios',
  'Insects & Spiders': 'Insectos y Arañas',
  'Marine Life': 'Vida Marina',
  'Plants & Trees': 'Plantas y Árboles',
  'Other Notables': 'Otros Notables'
};

export function CategoryTabs({ activeFilter, onChange, language }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
      {/* Favorites */}
      <button
        onClick={() => onChange(activeFilter === 'Favorites' ? null : 'Favorites')}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
          activeFilter === 'Favorites'
            ? 'bg-stone-900 border-stone-900'
            : 'bg-white border-stone-200'
        }`}
        aria-label="Favorites"
      >
        <Star
          className={`w-4 h-4 ${
            activeFilter === 'Favorites' ? 'fill-white text-white' : 'text-stone-400'
          }`}
        />
      </button>

   {/* Biological categories */}
      {BIO_CATEGORIES.map((cat) => {
        const isActive = activeFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(isActive ? null : cat)}
            className={`flex-shrink-0 px-4 h-10 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap shadow-sm ${
              isActive
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200'
            }`}
          >
            {language === 'EN' ? cat : (CATEGORY_ES[cat] || cat)}
          </button>
        );
      })}
    </div>
  );
}
