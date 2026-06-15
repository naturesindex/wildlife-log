import { Star } from 'lucide-react';
import { Species, Language } from '../types';

interface SpeciesCardProps {
  species: Species;
  language: Language;
  onToggleLog: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? 'bg-stone-900 border-stone-900' : 'border-stone-300 bg-white'
      }`}
    >
      {checked && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
}

export function SpeciesCard({
  species,
  language,
  onToggleLog,
  onToggleFavorite,
}: SpeciesCardProps) {
  const primaryName = language === 'EN' ? species.nameEN : species.nameES;
  const secondaryName = language === 'EN' ? species.nameES : species.nameEN;

  return (
    <div
      onClick={() => onToggleLog(species.id)}
      className={`flex items-center gap-3 bg-white rounded-[1.75rem] border-2 p-3 pr-4 cursor-pointer select-none transition-all duration-150 ${
        species.isLogged ? 'border-stone-800' : 'border-stone-200'
      }`}
    >
      {/* Photo thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={species.image}
          alt={species.nameEN}
          className="w-[4.5rem] h-[4.5rem] rounded-2xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300';
          }}
        />
        {/* Favorite star overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(species.id);
          }}
          className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${
            species.isFavorite ? 'bg-amber-400' : 'bg-white border border-stone-200'
          }`}
          aria-label={species.isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star
            className={`w-3 h-3 ${species.isFavorite ? 'fill-white text-white' : 'text-stone-300'}`}
          />
        </button>
      </div>

      {/* Names */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-stone-900 text-[1.0625rem] leading-snug truncate">
          {primaryName}
        </p>
        <p className="text-stone-400 text-sm leading-snug truncate">{secondaryName}</p>
      </div>

      {/* Checkbox toggle */}
      <Checkbox checked={species.isLogged} />
    </div>
  );
}
