import { Species, Language } from '../types';
import { SpeciesCard } from './SpeciesCard';

interface SpeciesGridProps {
  species: Species[];
  language: Language;
  onToggleLog: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function SpeciesGrid({
  species,
  language,
  onToggleLog,
  onToggleFavorite,
}: SpeciesGridProps) {
  if (species.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <p className="text-stone-400 font-medium">No species found</p>
        <p className="text-stone-300 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-28">
      {species.map((s) => (
        <SpeciesCard
          key={s.id}
          species={s}
          language={language}
          onToggleLog={onToggleLog}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
