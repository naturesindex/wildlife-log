import { useState, useMemo, useEffect, useCallback } from 'react';
import { Species, BioCategory } from './types';
import { initialSpecies } from './data/species';
import { Header } from './components/Header';
import { SearchBar, CategoryTabs } from './components/Filters';
import { SpeciesGrid } from './components/SpeciesGrid';
import { ExportView } from './components/ExportView';

type ActiveFilter = BioCategory | 'Favorites' | null;

function fuzzyMatch(str: string | undefined, query: string): boolean {
  if (!str) return false;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

/** Normalize a raw species record from the database by filling in UI-state defaults. */
function normalize(raw: Species): Species {
  return {
    ...raw,
    isLogged: raw.isLogged ?? false,
    isFavorite: raw.isFavorite ?? false,
  };
}

function GuideNameModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="font-serif text-stone-900 font-black text-2xl mb-2">
          Almost ready!
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Enter your name for the passport and social story.
        </p>

        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
          Guide's Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onConfirm(name)}
          placeholder="e.g. Maria Rodríguez"
          autoFocus
          className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-stone-900 font-medium placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors mb-5 text-base"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-stone-200 text-stone-500 font-bold text-sm transition-all hover:border-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(name)}
            className="flex-1 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
            style={{ backgroundColor: '#C86A27' }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [species, setSpecies] = useState<Species[]>(
    () => (initialSpecies as Species[]).map(normalize)
  );
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [guideName, setGuideName] = useState('');

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 140);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLog = useCallback((id: string) => {
    setSpecies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLogged: !s.isLogged } : s))
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setSpecies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  }, []);

  const loggedCount = useMemo(() => species.filter((s) => s.isLogged).length, [species]);
  const loggedSpecies = useMemo(() => species.filter((s) => s.isLogged), [species]);

  const filteredSpecies = useMemo(() => {
    let result = species;

    if (activeFilter === 'Favorites') {
      result = result.filter((s) => s.isFavorite);
    } else if (activeFilter !== null) {
      result = result.filter((s) => s.category === activeFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter(
        (s) =>
          fuzzyMatch(s.nameEN, searchQuery) ||
          fuzzyMatch(s.nameES, searchQuery) ||
          fuzzyMatch(s.category, searchQuery)
      );
    }

    return result;
  }, [species, activeFilter, searchQuery]);

  const handleGenerateClick = () => setShowModal(true);

  const handleModalConfirm = (name: string) => {
    setGuideName(name);
    setShowModal(false);
    setShowExport(true);
  };

  if (showExport) {
    return (
      <ExportView
        loggedSpecies={loggedSpecies}
        language={language}
        guideName={guideName}
        onBack={() => setShowExport(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header
        language={language}
        onLanguageToggle={() => setLanguage((l) => (l === 'EN' ? 'ES' : 'EN'))}
        loggedCount={loggedCount}
        isScrolled={isScrolled}
      />

      <div className="max-w-lg mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryTabs activeFilter={activeFilter} onChange={setActiveFilter} />
        <SpeciesGrid
          species={filteredSpecies}
          language={language}
          onToggleLog={toggleLog}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Sticky Generate Passport button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleGenerateClick}
            className="w-full text-white font-black text-base py-4 rounded-3xl shadow-lg shadow-[#C86A27]/25 transition-all active:scale-95"
            style={{ backgroundColor: '#C86A27' }}
          >
            Generate Passport
          </button>
        </div>
      </div>

      {/* Guide name modal */}
      {showModal && (
        <GuideNameModal
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
